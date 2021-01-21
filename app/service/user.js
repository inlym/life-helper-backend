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
    if (!openid || typeof openid !== 'string') {
      throw new Error('参数错误: openid为空或非字符串')
    }

    const result = await this.app.model.User.findOne({
      where: {
        openid,
      },
    })

    if (!result) {
      this.logger.info(
        `通过openid从用户表中查询获取userId > openid => ${openid} 在用户表中未找到，为新用户`
      )
      return NOT_EXIST_USER_ID
    } else {
      this.logger.info(
        `通过openid从用户表中查询获取userId openid => ${openid} / userId => ${result.id}`
      )
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

    const row = {
      openid,
    }

    const result = await this.app.model.User.create(row)
    this.logger.info(`已创建新用户 - userId => ${result.id}`)
    return result.id
  }
}

module.exports = UserService
