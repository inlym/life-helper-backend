'use strict'

const { Service } = require('egg')

class RecordService extends Service {
  async loginInfo(options) {
    const { app, ctx, service, logger } = this
    const { code, openid, userId, token } = options

    const ip = ctx.ip

    // 本地测试时不需要记录
    if (ip === '127.0.0.1') {
      return
    }

    const { nation, province, city, district, adcode, lng, lat } = await service.api3rd.getLocation(
      ip
    )

    const row = {
      user_id: userId,
      code,
      openid,
      token,
      ip,
      nation,
      province,
      city,
      district,
      adcode,
      longitude: lng,
      latitude: lat,
    }

    logger.debug(`登录信息日志 => ${JSON.stringify(row)}`)

    app.model.LoginLog.create(row)
  }
}

module.exports = RecordService
