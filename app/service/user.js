'use strict'

const { Service } = require('egg')

/** 当返回用户ID为 0 时，表示该用户不存在 */
const NOT_EXIST_USER_ID = 0

class UserService extends Service {
  /**
   * 通过 openid 从用户（user）表中查找用户 ID，如果未找到则返回 0
   * @param {string} openid
   * @returns {Promise<number>} userId
   */
  async getUserIdByOpenid(openid) {
    const { app, logger } = this

    const result = await app.model.User.findOne({
      where: {
        openid,
      },
    })

    if (!result) {
      logger.debug(`[Mysql][user] -> openid => ${openid} 对应用户不存在`)
      return NOT_EXIST_USER_ID
    } else {
      logger.debug(`[Mysql][user] -> openid => ${openid} / userId => ${result.id}`)
      return result.id
    }
  }

  /**
   * 在判断 openid 不存在的情况下，创建新用户，并返回用户 id
   * @param {!string} openid
   * @returns {Promise<number>} 新用户的 userId
   */
  async createNewUser(openid) {
    if (!openid || typeof openid !== 'string') {
      throw new Error('参数错误: openid为空或非字符串')
    }

    const { app, logger } = this

    const row = {
      openid,
    }

    const result = await app.model.User.create(row)
    logger.info(`[Mysql][user] 创建新用户 -> userId => ${result.id}`)
    return result.id
  }

  /**
   * 通过小程序传递的 code 获取 userId
   * 1. 包含了创建新用户操作
   * @param {!string} code
   * @returns {Promise<number>}
   */
  async getUserIdByCode(code) {
    const { service } = this

    const openid = await service.mp.code2Openid(code)
    let userId = await this.getUserIdByOpenid(openid)

    if (userId === NOT_EXIST_USER_ID) {
      userId = await this.createNewUser(openid)
    }

    return userId
  }
}

module.exports = UserService
