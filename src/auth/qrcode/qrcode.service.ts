import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import { AliyunOssConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { OssService } from 'src/shared/oss/oss.service'
import { WeixinService } from 'src/shared/weixin/weixin.service'
import { v4 as uuidv4 } from 'uuid'
import { Authentication, AuthenticationStatus, QrcodeProfile } from './qrcode.model'

@Injectable()
export class QrcodeService {
  private readonly logger = new Logger(QrcodeService.name)

  private readonly redis: Redis

  /** 存储二维码的 OSS 绑定的 URL */
  private readonly ossURL: string = AliyunOssConfig.res.url

  /** 用于存储二维码图片的目录名称 */
  private readonly dirname = 'wxacode'

  constructor(private readonly redisService: RedisService, private readonly weixinService: WeixinService, private readonly ossService: OssService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 获取检验码对应的 Redis 键名
   *
   * @param code 检验码
   */
  private getRedisKey(code: string): string {
    return `auth:authentication:code:${code}`
  }

  /**
   * 获取用于存储校验码列表的 Redis 键名
   */
  private getListRedisKey(): string {
    return 'auth:authentication:list'
  }

  /**
   * 根据校验码获取对应的二维码 URL
   *
   * @param code 检验码
   */
  private getQrcodeUrl(code: string): string {
    return this.ossURL + '/' + this.dirname + '/' + code
  }

  /**
   * 生成一份身份认证凭证信息，存于 Redis，后续操作均围绕着这个认证信息
   */
  private async createAuthentication(): Promise<string> {
    /**
     * 校验码
     *
     *
     * ### 为什么去掉短横线？
     *
     * ```markdown
     * 1. 生成小程序码环节的参数 `scene` 最多支持 32 个字符，uuid 去掉短横线后刚好 32 个字符。
     * ```
     */
    const code = uuidv4().replace(/-/gu, '')

    const authentication: Authentication = {
      status: AuthenticationStatus.Created,
      createTime: Date.now(),
    }

    const rKey = this.getRedisKey(code)

    /** 有效期 */
    const expiration = 3600 * 24 * 10

    await this.redis.set(rKey, JSON.stringify(authentication), 'EX', expiration)
    return code
  }

  /**
   * 生成用于扫码登录的二维码
   *
   * ### 备注
   *
   * ```markdown
   * 1. 目前实际上使用小程序码，非标准的二维码。
   * ```
   */
  private async generateQrcode(): Promise<string> {
    /** 小程序中定义的页面 */
    const page = 'pages/auth/login-confirm/login-confirm'

    /** 校验码 */
    const code = await this.createAuthentication()

    /** 存储于 OSS 的文件路径 */
    const filename = this.dirname + '/' + code

    const buf = await this.weixinService.getUnlimitedWxacode({ scene: code, page })
    await this.ossService.upload(filename, buf, { headers: { 'Content-Type': 'image/png' } })

    return code
  }

  /**
   * 新增随机个（1~3）二维码，并将数据添加到二维码列表中
   *
   * ### 备注
   *
   * ```markdown
   * 1. 这个方法处理除了使用资源进行存储外，无任何副作用，可任意无限次调用。
   * ```
   */
  private async addQrcode(): Promise<void> {
    const counter = Math.ceil(Math.random() * 3)

    for (let i = 0; i < counter; i++) {
      const rListKey: string = this.getListRedisKey()
      const code = await this.generateQrcode()
      await this.redis.rpush(rListKey, code)
    }
  }

  /**
   * 获取二维码信息
   */
  async getQrcode(): Promise<QrcodeProfile> {
    // 异步执行，不要加 `await`
    this.addQrcode()

    /** 校验码 */
    let code: string

    const rListKey: string = this.getListRedisKey()
    code = await this.redis.lpop(rListKey)

    if (!code) {
      code = await this.generateQrcode()
    }

    const url = this.getQrcodeUrl(code)
    return { code, url }
  }

  /**
   * 扫码操作
   *
   * @param userId 用户 ID
   * @param code 校验码
   */
  async scan(userId: number, code: string): Promise<Authentication> {
    const rKey = this.getRedisKey(code)

    const result = await this.redis.get(rKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authen: Authentication = JSON.parse(result)
    if (authen.status === AuthenticationStatus.Created) {
      authen.status = AuthenticationStatus.Scanned
      authen.scanTime = Date.now()
      authen.scanUserId = userId

      await this.redis.set(rKey, JSON.stringify(authen), 'EX', 3600 * 2)
    }

    return authen
  }

  /**
   * 确认登录操作
   *
   * @param userId 用户 ID
   * @param code 校验码
   */
  async confirm(userId: number, code: string): Promise<Authentication> {
    const rKey = this.getRedisKey(code)

    const result = await this.redis.get(rKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authen: Authentication = JSON.parse(result)
    if (authen.status === AuthenticationStatus.Created || authen.status === AuthenticationStatus.Scanned) {
      authen.status = AuthenticationStatus.Confirmed
      authen.confirmTime = Date.now()
      authen.confirmUserId = userId

      await this.redis.set(rKey, JSON.stringify(authen), 'EX', 60 * 10)
    }

    return authen
  }

  /**
   * 使用身份凭证
   *
   * @param userId 用户 ID
   * @param code 校验码
   */
  async consume(userId: number, code: string): Promise<Authentication> {
    const rKey = this.getRedisKey(code)

    const result = await this.redis.get(rKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authen: Authentication = JSON.parse(result)
    if (authen.status === AuthenticationStatus.Confirmed) {
      authen.status = AuthenticationStatus.Consumed
      authen.consumeTime = Date.now()

      await this.redis.set(rKey, JSON.stringify(authen), 'EX', 60 * 10)
    }

    return authen
  }

  /**
   * 查询校验码状态
   *
   * @param code 校验码
   */
  async query(code: string): Promise<Authentication> {
    const rKey = this.getRedisKey(code)

    const result = await this.redis.get(rKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authen: Authentication = JSON.parse(result)
    return authen
  }
}
