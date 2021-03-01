'use strict'

const { Controller } = require('egg')

class UserInfoController extends Controller {
  /**
   * @api {get} /user/info 获取用户的个人资料
   * @apiName getUserInfo
   * @apiGroup userinfo
   * @apiDescription 用于获取用户的个人资料
   * @apiVersion 0.0.3
   *
   * @apiSuccess (Response) {String} nickname 用户昵称
   * @apiSuccess (Response) {String} avatarUrl 头像URL地址
   */
  async getUserInfo() {
    const { ctx, service } = this
    ctx.body = await service.userInfo.getUserInfo(ctx.userId)
  }

  /**
   * @api {post} /user/info 更新用户个人信息
   * @apiName updateUserInfo
   * @apiGroup userinfo
   * @apiDescription 用于更新用户个人信息
   * @apiVersion 0.0.3
   *
   * @apiParam (Body) {String} nickName 用户昵称
   * @apiParam (Body) {String} avatarUrl 用户头像图片的 URL
   * @apiParam (Body) {Number} gender 用户性别：0-未知，1-男性，2-女性
   * @apiParam (Body) {String} country 用户所在国家
   * @apiParam (Body) {String} province 用户所在省份
   * @apiParam (Body) {String} city 用户所在城市
   * @apiParam (Body) {String} language 显示 country，province，city 所用的语言
   */
  async updateUserInfo() {
    const { ctx, service } = this
    const userInfo = ctx.request.body
    await service.userInfo.updateUserInfo(ctx.userId, userInfo)
    ctx.body = {
      errcode: 0,
    }
  }
}

module.exports = UserInfoController
