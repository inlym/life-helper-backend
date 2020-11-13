'use strict'

// Todo

const { Service } = require('egg')

class AuthService extends Service {
  /**
   *  为指定用户 id 生成 token 并存入 Redis。
   *  - 有效期 2 天
   *
   *  格式：
   *  - key    =>   token:${token}
   *  - value  =>   ${userId}
   * @param {number} userId
   */
  async createTokenForUserId(userId) {
    if (!userId || typeof userId !== 'number') {
      throw new Error('参数错误: userId为空或非数字')
    }

    const TOKEN_LENGTH = 64
    // eslint-disable-next-line no-magic-numbers
    const EXPIRATION = 3600 * 24 * 2

    const token = generateRandomString(TOKEN_LENGTH)
    this.ctx.logger.debug(`token => ${token}`)
    const result = await this.app.redis.set(`token:${token}`, userId, 'EX', EXPIRATION)
    if (result === 'OK') {
      return token
    } else {
      return Promise.reject(new Error('内部错误'))
    }
  }

  /**
   *  通过 token 从 Redis 中获取用户 id。
   *  如果存在则直接返回用户 id，不存在则返回 0。
   * @param {string} token
   */
  async getUserIdByToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('参数错误: token为空或非字符串')
    }
    const NOT_EXIST_USER_ID = 0

    const result = await this.app.redis.get(`token:${token}`)
    if (!result) {
      return NOT_EXIST_USER_ID
    } else {
      return parseInt(result, 10)
    }
  }

  /**
   *  微信登录接口，提交 code 返回 token
   *  - 判断是否是老用户，如果是新用户自动完成注册流程
   *
   * @param {string} code
   */
  async wxLogin(code) {
    if (!code || typeof code !== 'string') {
      throw new Error('参数错误: code为空或非字符串')
    }

    // 先通过 code 拿到 openid
    const { openid } = await fetchSessionByCode(code)

    // 获取 userId
    let userId = await getUserIdByOpenid(openid)

    const NOT_EXIST_USER_ID = 0
    if (userId === NOT_EXIST_USER_ID) {
      userId = await createNewUser(openid)
    }

    const token = await createTokenForUserId(userId)
    return token
  }
}

module.exports = AuthService
