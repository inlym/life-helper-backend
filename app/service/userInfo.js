'use strict'

const { Service } = require('egg')

class UserinfoService extends Service {
  /**
   * 更新用户资料（从小程序授权获取的用户信息）
   * - 小程序端使用 wx.getUserInfo() 方法获取的信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html
   * @param {object} userInfo 用户资料
   * @param {string} userInfo.avatarUrl 用户头像图片的 URL
   * @param {string} userInfo.city 用户所在城市
   * @param {string} userInfo.country 用户所在国家
   * @param {number} userInfo.gender 用户性别：0-未知，1-男性，2-女性
   * @param {string} userInfo.language 显示 country，province，city 所用的语言：'en'-英文，'zh_CN'-简体中文	，'zh_TW'-繁体中文
   * @param {string} userInfo.nickName 用户昵称
   * @param {string} userInfo.province 用户所在省份
   */
  async updateUserInfo(userId, userInfo) {
    const { app } = this
    const { avatarUrl, city, country, gender, nickName, province } = userInfo

    const result = await app.model.UserInfo.update(
      { avatarUrl, city, country, gender, nickName, province },
      {
        where: {
          id: userId,
        },
      }
    )

    return result
  }

  /**
   * 获取指定用户的个人信息（昵称、头像、性别）
   * @param {?number} userId 用户 id
   * @returns {Promise<{nickname:string;avatar_url:string;gender:number;}>}
   */
  async getUserInfo(userId) {
    const { app } = this

    const result = await app.model.UserInfo.findByPk(userId, {
      attributes: ['nickName', 'avatarUrl'],
    })

    return result
  }
}

module.exports = UserinfoService
