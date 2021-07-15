import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AliyunOssConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { v4 as uuidv4 } from 'uuid'
import { OssService } from '../oss/oss.service'
import { WeixinService } from '../weixin/weixin.service'
import { AuthenticationStatus, IAuthentication, QrcodeProfile, QueryQrcodeResult } from './qrcode.model'

/**
 * 当前服务用于处理 [扫码登录] 相关逻辑
 */
@Injectable()
export class QrcodeService {
  constructor(private readonly weixinService: WeixinService, private readonly ossService: OssService, private readonly redisService: RedisService) {}

  /**
   * 获取存储于 Redis 的 [认证信息] 键名
   */
  getRedisKey(code: string): string {
    return `auth:authentication:code:${code}`
  }

  /**
   * `code` 列表的键名
   */
  getListRedisKey() {
    return 'auth:authentication:list:valid'
  }

  /**
   * 生成一份身份认证信息，存于 Redis，后续操作均围绕着这个认证信息
   *
   * 备注：
   * 1. 这个身份认证信息可以用于多渠道（目前仅小程序使用），均围绕着使用校验码（`code`）作为参数去处理
   * 2. 后续可拓展渠道有：普通 URL 链接、普通二维码等
   * 3. 后续模块多了再将这个方法移出
   */
  async createAuthentication(): Promise<string> {
    /**
     * 校验码
     * [去掉短横线的原因]
     * - 生成小程序码环节的参数 `scene` 最多支持 32 个字符，uuid （36）去掉短横线后刚好 32 个字符。
     */
    const code = uuidv4().replace(/-/gu, '')

    /** 认证信息 */
    const authentication: IAuthentication = {
      status: AuthenticationStatus.Created,
      createTime: Date.now(),
      visitTime: 0,
      checkTime: 0,
      consumeTime: 0,
      userId: 0,
    }

    const redisKey = this.getRedisKey(code)
    const redis = this.redisService.getClient()

    // 有效期：10天，会提前创建好，可能放着一直没用
    await redis.set(redisKey, JSON.stringify(authentication), 'EX', 3600 * 24 * 10)

    return code
  }

  /**
   * 生成用于扫码登录的小程序码相关信息（图片本身存储于 OSS，仅返回 url 地址）
   */
  async generateQrcode(): Promise<QrcodeProfile> {
    /** 小程序中定义的页面 */
    const page = 'pages/login/login-confirm/login-confirm'

    /** 返回的 URL 的 `origin` 部分 */
    const baseURL = AliyunOssConfig.res.url

    /** 校验码 */
    const code = await this.createAuthentication()

    /** 存储于 OSS 的文件路径 */
    const filename = 'wxacode/' + code

    const buf = await this.weixinService.getUnlimitedWxacode({ scene: code, page })
    await this.ossService.upload(filename, buf, { headers: { 'Content-Type': 'image/png' } })

    return { url: baseURL + '/' + filename, code }
  }

  /**
   * 生成并存储小程序码信息到 Redis 中（这个方法可以任意异步调用，不影响主逻辑）
   */
  async storeQrcode(): Promise<QrcodeProfile> {
    const redisKey = this.getListRedisKey()
    const qrcode: QrcodeProfile = await this.generateQrcode()
    const redis = this.redisService.getClient()
    await redis.rpush(redisKey, JSON.stringify(qrcode))
    return qrcode
  }

  /**
   * 获取一份检验码信息
   */
  async getQrcode(): Promise<QrcodeProfile> {
    const redisKey = this.getListRedisKey()
    const redis = this.redisService.getClient()

    // 异步加一个存储任务（流程外，相当于为下一次获取节省时间）
    this.storeQrcode()

    const qrcodeStr = await redis.lpop(redisKey)
    if (qrcodeStr) {
      return JSON.parse(qrcodeStr)
    }

    return await this.generateQrcode()
  }

  /**
   * 对扫码操作进行记录
   */
  async scanQrcode(userId: number, code: string): Promise<void> {
    const redisKey = this.getRedisKey(code)
    const redis = this.redisService.getClient()
    const result = await redis.get(redisKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authentication: IAuthentication = JSON.parse(result)
    if (authentication.status === AuthenticationStatus.Created) {
      authentication.status = AuthenticationStatus.Visited
      authentication.visitTime = Date.now()
    }

    await redis.set(redisKey, JSON.stringify(authentication), 'EX', 3600 * 2)
  }

  /**
   * 用户对指定校验码进行认证
   */
  async checkQrcode(userId: number, code: string) {
    const redisKey = this.getRedisKey(code)
    const redis = this.redisService.getClient()
    const result = await redis.get(redisKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请刷新后重新扫描！' }, HttpStatus.BAD_REQUEST)
    }

    const authentication: IAuthentication = JSON.parse(result)

    if ([AuthenticationStatus.Created, AuthenticationStatus.Visited].includes(authentication.status)) {
      authentication.status = AuthenticationStatus.Checked
      authentication.checkTime = Date.now()
      authentication.userId = userId
    }

    await redis.set(redisKey, JSON.stringify(authentication), 'EX', 60 * 30)
  }

  /**
   * 用于查询校验码状态
   */
  async queryQrcode(code: string): Promise<QueryQrcodeResult> {
    const redisKey = this.getRedisKey(code)
    const redis = this.redisService.getClient()
    const result = await redis.get(redisKey)
    if (!result) {
      throw new HttpException({ message: '当前二维码已失效，请点击刷新重新获取！' }, HttpStatus.BAD_REQUEST)
    }

    const authentication: IAuthentication = JSON.parse(result)
    return { status: authentication.status, userId: authentication.userId }
  }
}
