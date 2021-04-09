'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class AuthService extends Service {
  /**
   * 为指定用户 ID 生成 token，并存入 Redis
   * @param {number} userId
   * @returns {Promise<string>} 生成的 token
   * @update 2021-03-25
   * @description
   * 1. 前期做了优化，短时间内多次请求拿到同一个 token，实际上有安全隐患，不如就不要钱的生成就可以了，不需要节约空间。
   * 2. 此处去掉了日志，这个地方除非 Redis 挂了，不然不会出错，日志太多了。
   * 3. token 有效期 2 天，正常情况下，不会有用户连续登着小程序达到 2 天的。
   */
  async createToken(userId) {
    const { app, service } = this
    const token = app.str32()
    const { key, timeout } = service.keys.token2UserId(token)
    app.redis.set(key, userId, 'EX', timeout)
    return token
  }

  /**
   * 使用 token 从 Redis 中获取 userId，如果不存在则返回 0
   * @param {string} token
   * @returns {Promise<number>} userId
   * @update 2021-03-25
   */
  async getUserIdByToken(token) {
    const { app, service, logger } = this
    const { key } = service.keys.token2UserId(token)
    const result = await app.redis.get(key)
    if (!result) {
      // token 有效期 2 天，理论上不会到这一步
      logger.warn(`[Redis] token=${token} 无效`)
      return NOT_EXIST_USER_ID
    } else {
      return parseInt(result, 10)
    }
  }

  /**
   * 账户登录，发放 token
   * @param {number} userId 用户 ID
   * @return {Promise<string>} 登录凭证
   */
  async login(userId) {
    const token = await this.createToken(userId)
    return token
  }
}

module.exports = AuthService
