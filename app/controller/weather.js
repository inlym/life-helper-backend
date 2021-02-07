'use strict'

const { Controller } = require('egg')

class WeatherController extends Controller {
  /**
   * 获取实时天气情况
   * @update 2021-02-07
   *
   * method   =>    GET
   * path     =>    /weather/now
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
   */
  async now() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.condition(cityId)
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
