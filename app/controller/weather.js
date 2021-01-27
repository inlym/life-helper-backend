'use strict'

const { Controller } = require('egg')

class WeatherController extends Controller {
  /**
   * 获取实时天气情况
   * method   =>    GET
   * path     =>    /weather/now
   * query    =>    1. lon - 经度 - 可选
   *                2. lat - 纬度 - 可选
   * body     =>    null
   *
   * 备注：
   * 1. 经纬度如果在 query 中提供，则取该值，否则由 ip 转换获取
   * 2. 经纬度格式化到 5 位小数
   * longitude, latitude
   */
  async realtime() {
    const { ctx, service, logger } = this

    /** 经度 */
    let longitude = ''

    /** 纬度 */
    let latitude = ''

    if (ctx.query.lon && ctx.query.lat) {
      longitude = ctx.query.lon
      latitude = ctx.query.lat
      logger.debug(`从 query 获取经纬度 -> longitude => ${longitude} / latitude => ${latitude}`)
    } else {
      const location = await service.api3rd.getLocation(ctx.ip)
      longitude = location.lng
      latitude = location.lat
    }

    // 对经纬度格式化处理：统一转换成带 5 位小数的字符串
    longitude = Number(longitude).toFixed(5)
    latitude = Number(latitude).toFixed(5)

    ctx.body = await service.api3rd.getWeatherCondition(longitude, latitude)
  }
}

module.exports = WeatherController
