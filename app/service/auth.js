'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class AuthService extends Service {
  /**
   * 为指定用户ID生成 token，并存入 Redis （如果 token 存在，则返回已有的 token 并重置有效期）
   * @param {number} userId
   * @returns {Promise<string>} 生成的 token
   */
  async createToken(userId) {
    const { app, logger } = this

    /** token 的长度为 64 个英文字符 */
    const TOKEN_LENGTH = 64

    /** token 存入 Redis 的有效期为 2 天 */
    const EXPIRATION = 3600 * 24 * 2

    const tokenInRedis = await app.redis.get(`user_id#token:${userId}`)

    // 如果 token 在 Redis 中已存在
    if (tokenInRedis) {
      app.redis.expire(`user_id#token:${userId}`, EXPIRATION)
      app.redis.expire(`token#user_id:${tokenInRedis}`, EXPIRATION)
      return tokenInRedis
    }

    /** 生成随机字符串的 token */
    const token = app.kit.randomString(TOKEN_LENGTH)

    logger.debug(`为指定userId生成token -> userId => ${userId} / token => ${token}`)

    await app.redis.set(`token#user_id:${token}`, userId, 'EX', EXPIRATION)
    await app.redis.set(`user_id#token:${userId}`, token, 'EX', EXPIRATION)

    return token
  }

  /**
   * 使用 token 从 Redis 中获取 userId，如果不存在则返回 0
   * @param {string} token
   * @returns {Promise<number>}
   */
  async getUserIdByToken(token) {
    const { app, logger } = this

    const result = await app.redis.get(`token#user_id:${token}`)
    if (!result) {
      logger.debug(`token[${token}] 未从 Redis 中查询到对应 userId`)
      return NOT_EXIST_USER_ID
    } else {
      logger.debug(`token[${token}] 从 Redis 中查询到 userId => ${result}`)
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
    const userId = await service.user.getUserIdByCode(code)
    const token = await this.createToken(userId)
    return token
  }
}

module.exports = AuthService
