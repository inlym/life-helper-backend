import { Injectable } from '@nestjs/common'
import { RedisService } from 'nestjs-redis'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(private redisService: RedisService) {}

  /**
   * 为指定用户 ID 生成 token，并存入 Redis
   */
  async createToken(userId: number): Promise<string> {
    /** 有效期：2天 */
    const expiration = 3600 * 24 * 2

    /** `token` 是去掉短横线的 UUID 值 */
    const token: string = uuidv4().replace(/-/gu, '')

    /** 存入 Redis 的键名 */
    const redisKey = `user:id:token:${token}`

    /** 获取 Redis 实例 */
    const redis = await this.redisService.getClient()

    const result = await redis.set(redisKey, userId, 'EX', expiration)
    if (result === 'OK') {
      return token
    } else {
      throw new Error('调用 `redis.set` 方法时发生异常')
    }
  }
}
