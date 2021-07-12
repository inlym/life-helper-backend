import { Injectable } from '@nestjs/common'
import { AliyunOssConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { v4 as uuidv4 } from 'uuid'
import { OssService } from '../oss/oss.service'
import { WeixinService } from '../weixin/weixin.service'

@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisService, private readonly ossService: OssService, private readonly weixinService: WeixinService) {}

  /**
   * 为指定用户生成登录凭证 token
   * @param userId {number} 用户ID
   * @param expiration {number} 有效期（单位：秒），默认 10 天
   */
  async createToken(userId: number, expiration: number = 3600 * 24 * 10): Promise<string> {
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
   * 生成用于扫码登录的微信小程序码
   */
  async generateLoginWxacode(): Promise<string> {
    // 备注：临时使用测试页，后面再改回来
    const page = 'pages/test/test'

    const baseURL = AliyunOssConfig.res.url
    const checkCode = uuidv4().replace(/-/gu, '')
    const dirname = 'wxacode'
    const filename = dirname + '/' + checkCode

    const wxacodeBuf = await this.weixinService.getUnlimitedWxacode({ scene: checkCode, page })
    await this.ossService.upload(filename, wxacodeBuf)

    const redisKey = `auth:login-info:uuid:${checkCode}`
    const redis = this.redisService.getClient()
    await redis.set(redisKey, JSON.stringify({ createTime: Date.now() }), 'EX', 3600 * 24 * 2)
    return baseURL + '/' + filename
  }
}
