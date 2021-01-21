'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class AuthService extends Service {
  /**
   * 为指定用户ID生成 token，并存入 Redis
   * @param {number} userId
   * @returns {Promise<string>} 生成的 token
   */
  async createToken(userId) {
    if (!userId || typeof userId !== 'number') {
      throw new Error('参数错误: userId为空或非数字')
    }

    /** token 的长度为 64 个英文字符 */
    const TOKEN_LENGTH = 64

    /** token 存入 Redis 的有效期为 2 天 */
    const EXPIRATION = 3600 * 24 * 2

    /** 生成随机字符串的 token */
    const token = this.app.kit.randomString(TOKEN_LENGTH)

    this.logger.debug(`为指定userId生成token - userId => ${userId} / token => ${token}`)

    /** 将 token 存入 Redis 中 */
    await this.app.redis.set(`token:${token}`, userId, 'EX', EXPIRATION)

    return token
  }

  /**
   * 使用 token 从 Redis 中获取 userId，如果不存在则返回 0
   * @param {string} token
   * @returns {Promise<number>}
   */
  async getUserIdByToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('参数错误: token为空或非字符串')
    }

    const result = await this.app.redis.get(`token:${token}`)
    if (!result) {
      return NOT_EXIST_USER_ID
    } else {
      return parseInt(result, 10)
    }
  }

  /**
   * 微信登录，用 code 换取 token
   * @param {string} code
   * @returns {Promise<string>}
   */
  async wxLogin(code) {
    if (!code || typeof code !== 'string') {
      throw new Error('参数错误: code为空或非字符串')
    }

    // 通过 code 换取 openid
    const openid = await this.service.mp.code2Openid(code)

    // 通过 openid 换取 userId
    let userId = await this.service.user.getUserIdByOpenid(openid)

    if (userId === NOT_EXIST_USER_ID) {
      userId = await this.service.user.createNewUser(openid)
    }

    const token = await this.createToken(userId)
    return token
  }
}

module.exports = AuthService
