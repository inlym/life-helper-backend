'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class AuthService extends Service {
  /**
   * 为指定用户ID生成 token，并存入 Redis （如果 token 存在，则返回已有的 token 并重置有效期）
   * @param {number} userId
   * @returns {Promise<string>} 生成的 token
   * @update 2021-02-06
   */
  async createToken(userId) {
    const { app, logger } = this

    /** token 的长度为 64 个英文字符 */
    const TOKEN_LENGTH = 64

    /** token 存入 Redis 的有效期为 2 天 */
    const EXPIRATION = 3600 * 24 * 2

    /** Redis 键名 */
    const keyUserId2Token = `userId@token:${userId}`

    const tokenInRedis = await app.redis.get(keyUserId2Token)

    // 如果 token 在 Redis 中已存在
    if (tokenInRedis) {
      const keyToken2UserId1 = `token@userId:${tokenInRedis}`

      // 重置有效期
      app.redis.expire(keyUserId2Token, EXPIRATION)
      app.redis.expire(keyToken2UserId1, EXPIRATION)
      return tokenInRedis
    }

    /** 生成随机字符串的 token */
    const token = app.kit.randomString(TOKEN_LENGTH)

    const keyToken2UserId2 = `token@userId:${token}`

    logger.debug(`[Redis] 为指定userId生成token -> userId => ${userId} / token => ${token}`)

    app.redis.set(keyToken2UserId2, userId, 'EX', EXPIRATION)
    app.redis.set(keyUserId2Token, token, 'EX', EXPIRATION)

    return token
  }

  /**
   * 使用 token 从 Redis 中获取 userId，如果不存在则返回 0
   * @param {string} token
   * @returns {Promise<number>} userId
   * @update 2021-02-06
   */
  async getUserIdByToken(token) {
    const { app, logger } = this

    const keyToken2UserId = `token@userId:${token}`

    const result = await app.redis.get(keyToken2UserId)
    if (!result) {
      logger.debug(`[Redis] token => ${token} 未从 Redis 中查询到对应 userId`)
      return NOT_EXIST_USER_ID
    } else {
      logger.debug(`[Redis] token => ${token} -> userId => ${result}`)
      return parseInt(result, 10)
    }
  }

  /**
   * 微信登录，用 code 换取 token
   * @param {string} code
   * @returns {Promise<string>}
   */
  async wxLogin(code) {
    const { service } = this
    const openid = await service.mp.code2Openid(code)
    let userId = await service.user.getUserIdByOpenid(openid)
    if (!userId) {
      userId = await service.user.createNewUser(openid)
    }
    const token = await this.createToken(userId)

    service.record.loginInfo({ code, openid, userId, token })

    return token
  }
}

module.exports = AuthService
