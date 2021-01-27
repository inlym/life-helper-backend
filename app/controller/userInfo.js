'use strict'

const { Controller } = require('egg')

class UserInfoController extends Controller {
  /**
   * 获取用户的个人资料
   * method   =>    GET
   * path     =>    /user/info
   * query    =>    null
   * body     =>    null
   */
  async getUserInfo() {
    const { ctx, service } = this
    ctx.body = await service.user.getUserInfo()
  }

  /**
   * 更新用户的个人资料
   * method   =>    POST
   * path     =>    /user/info
   * query    =>    null
   * body     =>    userInfo
   *
   * userInfo @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/UserInfo.html
   * 小程序侧只需将获取的 rawData 字符串值原样上传即可，不需要做任何处理
   */
  async updateUserInfo() {
    const { ctx, service } = this
    const userInfo = ctx.request.body
    await service.user.updateUserInfo(userInfo)
    ctx.body = {
      errcode: 0,
    }
  }
}

module.exports = UserInfoController
