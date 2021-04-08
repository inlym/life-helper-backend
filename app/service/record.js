'use strict'

const { Service } = require('egg')
const only = require('only')

/**
 * 当前文件允许直接使用 ctx 获取请求的 ip 和 userId
 */
class RecordService extends Service {
  /**
   * @deprecated
   */
  async loginInfo(options) {
    const { app, ctx, service, logger } = this
    const { code, openid, userId, token } = options

    const ip = ctx.ip

    // 本地测试时不需要记录
    if (ip === '127.0.0.1') {
      return
    }

    const {
      result: {
        ad_info: { nation, province, city, district, adcode },
        location: { lat, lng },
      },
    } = await service.lbsqq.getLocationByIp(ip)

    const row = { user_id: userId, code, openid, token, ip, nation, province, city, district, adcode, longitude: lng, latitude: lat }

    app.model.LoginLog.create(row)
  }

  /**
   * 记录微信登录日志
   */
  async wxLogin() {
    const { ctx, service } = this

    const { userId, ip } = ctx
    if (ip === '127.0.0.1') {
      // 使用本地地址调用查询定位接口会报错，本地测试时直接不继续
      return
    }

    const { code, token } = ctx.state
    const { openid, unionid, session_key: sessionKey } = ctx.state.wxSession

    const {
      result: {
        ad_info: { nation, province, city, district, adcode },
        location: { lat: latitude, lng: longitude },
      },
    } = await service.lbsqq.getLocationByIp(ip)

    const row = { userId, code, openid, unionid, sessionKey, token, ip, nation, province, city, district, adcode, longitude, latitude }

    ctx.model.LoginLog.create(row)
  }
}

module.exports = RecordService
