'use strict'

const { Service } = require('egg')

/**
 * 当前文件允许直接使用 ctx 获取请求的 ip 和 userId
 */
class RecordService extends Service {
  /**
   * 记录微信登录日志
   */
  async wxLogin(options) {
    const { ctx, service } = this

    const { userId, ip } = ctx
    if (ip === '127.0.0.1') {
      // 使用本地地址调用查询定位接口会报错，本地测试时直接不继续
      return
    }

    const { token } = options
    const { code } = ctx.state.auth
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
