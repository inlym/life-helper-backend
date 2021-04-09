'use strict'

const { Service } = require('egg')

class UserService extends Service {
  /**
   * 通过 openid 从用户（user）表中查找用户 ID，如果未找到则自动创建一个新的
   * @param {object} session
   * @return {Promise<number>} userId
   */

  async getUserIdByWxSession(session) {
    const { app } = this
    const { openid, unionid } = session

    const [user, created] = await app.model.User.findOrCreate({
      where: {
        openid,
      },

      defaults: {
        unionid,
      },
    })

    // 如果是新创建的账户，则同步在 user_info 表也建立账户
    if (created) {
      app.model.UserInfo.create({
        id: user.id,
      })
    }

    return user.id
  }

  /**
   * 通过小程序传递的 code 获取 userId
   * 1. 包含了创建新用户操作
   * @param {!string} code
   * @return {Promise<number>} userId
   */
  async getUserIdByCode(code) {
    const { service } = this
    const session = await service.mp.code2Session(code)
    const userId = await this.getUserIdByWxSession(session)
    return userId
  }
}

module.exports = UserService
