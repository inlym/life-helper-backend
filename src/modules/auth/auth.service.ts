import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import { v4 as uuidv4 } from 'uuid'
import { OssService } from '../oss/oss.service'

@Injectable()
export class AuthService {
  constructor(private readonly redisService: RedisService, private readonly ossService: OssService) {}

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
}
