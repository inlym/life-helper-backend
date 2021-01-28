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
    const { app, ctx, service, logger } = this

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

    // 获取天气实况
    const weatherCondition = await service.api3rd.getWeatherCondition(longitude, latitude)

    /** icon 图片地址前缀 */
    const iconUrlPrefix = 'https://img.lh.inlym.com/weather_icon/'

    /** 响应内容 */
    const response = {}

    /** 市区定位名称 */
    response.location = weatherCondition.city.name

    /** 实时天气情况 */
    response.condition = weatherCondition.condition.condition

    /** 温度 */
    response.temperature = weatherCondition.condition.temp

    /** 体感温度 */
    response.sensibleTemperature = weatherCondition.condition.realFeel

    /** 天气 icon 图标的 url */
    response.iconUrl = `${iconUrlPrefix}${weatherCondition.condition.icon}.png`

    /** 气压 */
    response.airPressure = weatherCondition.condition.pressure

    /** 湿度 */
    response.humidity = weatherCondition.condition.humidity

    /** 紫外线强度 */
    response.ultraviolet = weatherCondition.condition.uvi

    /** 能见度 */
    response.visibility = weatherCondition.condition.vis

    /** 风向 */
    response.windDirection = weatherCondition.condition.windDir

    /** 风力等级 */
    response.windScale = weatherCondition.condition.windLevel

    /** 风速 */
    response.windSpeed = weatherCondition.condition.windSpeed

    /** 一句话提示 */
    response.tip = weatherCondition.condition.tips

    /** 日出时间，格式化为 '6:08' 输出 */
    response.sunrise = app.dayjs(weatherCondition.condition.sunRise).format('H:mm')

    /** 日落时间，格式化为 '6:08' 输出 */
    response.sunset = app.dayjs(weatherCondition.condition.sunSet).format('H:mm')

    ctx.body = response
  }
}

module.exports = WeatherController
