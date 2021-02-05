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
    const iconUrlPrefix = '/image/weather_icon/'

    /** 准备从 weatherCondition.condition 提取的属性，赋值到 response */
    const keys = [
      /** 实时天气情况 */
      'condition',

      /** 温度 */
      'temp:temperature',

      /** 体感温度 */
      'realFeel:sensibleTemperature',

      /** 气压 */
      'pressure:airPressure',

      /** 湿度 */
      'humidity',

      /** 紫外线强度 */
      'uvi:ultraviolet',

      /** 能见度 */
      'vis:visibility',

      /** 风向 */
      'windDir:windDirection',

      /** 风力等级 */
      'windLevel:windScale',

      /** 风速 */
      'windSpeed',

      /** 一句话提示 */
      'tips:tip',
    ]

    /** 响应内容 */
    const response = app.only2(weatherCondition.condition, keys)

    /** 市区定位名称 */
    response.location = weatherCondition.city.name

    /** 天气 icon 图标的 url */
    response.iconUrl = `${iconUrlPrefix}${weatherCondition.condition.icon}.png`

    /** 日出时间，格式化为 '6:08' 输出 */
    response.sunrise = app.dayjs(weatherCondition.condition.sunRise).format('H:mm')

    /** 日落时间，格式化为 '6:08' 输出 */
    response.sunset = app.dayjs(weatherCondition.condition.sunSet).format('H:mm')

    ctx.body = response
  }

  /**
   * 获取未来 15 天的天气预报
   * @since 2021-02-05
   *
   * method   =>    GET
   * path     =>    /weather/forecast15days
   * query    =>    1. lon - 经度（longitude） - 可选
   *                2. lat - 纬度（latitude） - 可选
   * body     =>    null
   *
   * 优先级：
   * 1. 在 query 中提供的经纬度
   * 2. 从缓存中获取用户的 cityId
   * 3. 根据访问 ip 换取的经纬度
   */
  async forecast15Days() {
    const { app, ctx, service, logger } = this

    const { lon, lat } = ctx.query

    logger.debug(`[Query] lon => ${lon} / lat => ${lat}`)

    if (lon && lat) {
      ctx.body = await service.weather.forecast15Days({
        longitude: lon,
        latitude: lat,
      })
      return
    }

    const userKey = `user:${ctx.userId}`

    const cityId = await app.redis.hget(userKey, 'cityId')
    if (cityId) {
      logger.debug(`[Redis] [hash] ${userKey} -> cityId => ${cityId}`)
      ctx.body = await service.weather.forecast15Days({
        cityId,
      })
      return
    }

    const { lng: longitude, lat: latitude } = await service.api3rd.getLocation(ctx.ip)
    ctx.body = await service.weather.forecast15Days({
      longitude,
      latitude,
    })
  }
}

module.exports = WeatherController
