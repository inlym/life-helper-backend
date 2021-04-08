'use strict'

const { Service } = require('egg')

class UserService extends Service {
  /**
   * 通过 openid 从用户（user）表中查找用户 ID，如果未找到则自动创建一个新的
   * @param {string} openid
   * @return {Promise<number>} userId
   */
  async getUserIdByOpenid(openid) {
    const { app } = this
    const [user, created] = await app.model.User.findOrCreate({
      where: {
        openid,
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
   * @return {Promise<number>}
   */
  async getUserIdByCode(code) {
    const { service } = this
    const openid = await service.mp.code2Openid(code)
    const userId = await this.getUserIdByOpenid(openid)
    return userId
  }
}

module.exports = UserService
