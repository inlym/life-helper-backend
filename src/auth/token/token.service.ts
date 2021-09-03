import { Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import { RedisService } from 'nestjs-redis'
import { CommonException } from 'src/common/commom.exception'
import { v4 as uuidv4 } from 'uuid'

/**
 * 登录凭证服务
 *
 *
 * ### 功能说明
 *
 * ```markdown
 * 1. 用户登录状态管理，用户登录鉴权后，给用户发放登录凭证，后续访问携带该登录凭证表示其身份。
 * 2. 登录凭证目前只记录了对应的用户 ID。
 * ```
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name)
  private readonly redis: Redis

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 获取存储登录凭证的 Redis 键名
   *
   * @param token 登录凭证
   */
  private getTokenRedisKey(token: string): string {
    return `auth:user_id:token:${token}`
  }

  /**
   * 创建登录凭证
   *
   * @param userId 用户 ID
   * @param expiration 有效时长，单位：秒
   */
  async createToken(userId: number, expiration: number = 3600 * 24 * 10): Promise<string> {
    /**
     * ### 备注
     *
     * ```markdown
     * 1. 一般不会走到下面这个判断中。
     * 2. 使用中使用 `userId=0` 来标记未注册用户，为避免以后不小心进入这个逻辑，所以加了这个额外判断。
     * ```
     */
    if (userId < 1) {
      this.logger.error(`尝试创建一个异常登录凭证， userId => ${userId}`)
      throw new CommonException('登录失败！')
    }

    /** 登录凭证 */
    const token: string = uuidv4().replace(/-/gu, '')

    const rKey: string = this.getTokenRedisKey(token)
    await this.redis.set(rKey, userId, 'EX', expiration)

    return token
  }

  /**
   * 通过登录凭证换取用户 ID
   *
   * @param token 登录凭证
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. `token` 异常情况将返回结果 `0`。
   * ```
   */
  async getUserIdByToken(token: string): Promise<number> {
    const rKey = this.getTokenRedisKey(token)

    const result = await this.redis.get(rKey)
    if (result) {
      return parseInt(result, 10)
    }

    return 0
  }
}
