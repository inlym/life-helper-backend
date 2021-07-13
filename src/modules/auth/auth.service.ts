import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AliyunOssConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { ERRORS } from 'src/common/errors.constant'
import { v4 as uuidv4 } from 'uuid'
import { OssService } from '../oss/oss.service'
import { WeixinService } from '../weixin/weixin.service'
import { ConfirmLoginRequestDto } from './auth.dto'
import { CheckInfo } from './auth.model'

@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisService, private readonly ossService: OssService, private readonly weixinService: WeixinService) {}

  /**
   * 为指定用户生成登录凭证 tokenO
   * @param userId {number} 用户ID
   * @param expiration {number} 有效期（单位：秒），默认 10 天
   */
  async createToken(userId: number, expiration: number = 3600 * 24 * 10): Promise<string> {
    // 额外附加的一道校验，其余部分多处设定逻辑：如果用户不存在，返回用户 ID 为 `0`，避免带入到这里
    if (userId < 1) {
      throw new Error('userId 不允许小于 1')
    }

    /** `token` 是去掉短横线的 UUID 值 */
    const token: string = uuidv4().replace(/-/gu, '')

    /** 存入 Redis 的键名 */
    const redisKey = `auth:userid:token:${token}`

    // 获取 Redis 实例
    const redis = this.redisService.getClient()

    const result = await redis.set(redisKey, userId, 'EX', expiration)
    if (result === 'OK') {
      return token
    } else {
      throw new Error('调用 `redis.set` 方法时发生异常')
    }
  }

  /**
   * 通过用户登录凭证换取用户 ID
   * @param token {string} 用户登录凭证
   *
   * 说明：
   * 1. 如果 `token` 无效则返回 `0`
   */
  async getUserIdByToken(token: string): Promise<number> {
    /** Redis 的键名 */
    const redisKey = `auth:userid:token:${token}`

    // 获取 Redis 实例
    const redis = this.redisService.getClient()

    const result = await redis.get(redisKey)
    if (result) {
      return parseInt(result, 10)
    }
    return 0
  }

  /**
   * 生成待认证的校验码（主要用于扫码登录）
   */
  async generateCheckCode(): Promise<string> {
    /**
     * [去掉短横线的原因]
     * 生成小程序码环节的参数 `scene` 最多支持 32 个字符，uuid （36）去掉短横线后刚好 32 个字符。
     */
    const code = uuidv4().replace(/-/gu, '')
    const checkInfo: CheckInfo = {
      createTime: Date.now(),
      hasChecked: false,
      userId: 0,
    }

    const redisKey = `auth:check-info:code:${code}`
    const redis = this.redisService.getClient()
    await redis.set(redisKey, JSON.stringify(checkInfo), 'EX', 3600 * 4)

    return code
  }

  /**
   * 生成用于扫码登录的微信小程序码 url 和校验码
   */
  async generateLoginWxacode(): Promise<{ url: string; code: string }> {
    const page = 'pages/login/login-confirm/login-confirm'

    const baseURL = AliyunOssConfig.res.url
    const checkCode = await this.generateCheckCode()

    /** 包含路径的文件名 */
    const filename = 'wxacode/' + checkCode

    const wxacodeBuf = await this.weixinService.getUnlimitedWxacode({ scene: checkCode, page })
    await this.ossService.upload(filename, wxacodeBuf)

    return { url: baseURL + '/' + filename, code: checkCode }
  }

  /**
   * 对指定校验码进行认证
   */
  async confirmCheckCode(userId: number, data: ConfirmLoginRequestDto): Promise<boolean> {
    const { code } = data
    const redisKey = `auth:check-info:code:${code}`
    const redis = this.redisService.getClient()

    const result = await redis.get(redisKey)
    console.log('result: ', result)
    if (!result) {
      throw new HttpException(ERRORS.INVALID_LOGON_WXACODE, HttpStatus.FORBIDDEN)
    }

    const checkInfo: CheckInfo = JSON.parse(result)
    checkInfo.hasChecked = true
    checkInfo.userId = userId
    checkInfo.checkTime = Date.now()

    await redis.set(redisKey, JSON.stringify(checkInfo), 'EX', 600)
    return true
  }

  /**
   * 根据校验码获取用户 ID（返回 `0` 表示不存在）
   * @param code 校验码
   * @returns 用户 ID
   */
  async getUserIdByCheckCode(code: string): Promise<number> {
    const redisKey = `auth:check-info:code:${code}`
    const redis = this.redisService.getClient()

    const result = await redis.get(redisKey)
    if (!result) {
      throw new HttpException(ERRORS.INVALID_LOGON_WXACODE, HttpStatus.FORBIDDEN)
    }

    const checkInfo: CheckInfo = JSON.parse(result)
    if (checkInfo.hasChecked) {
      return checkInfo.userId
    }

    return 0
  }
}
