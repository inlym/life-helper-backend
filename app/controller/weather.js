'use strict'

const { Controller } = require('egg')

class WeatherController extends Controller {
  /**
   * 当前控制器的接受同样的 query，如下：
   * - province - 省份 - 可选
   * - city - 城市 - 可选
   * - district - 区县 - 可选
   * - latitude - 纬度 - 可选
   * - longitude - 经度 - 可选
   * - name - 地点名称 - 可选
   * - address - 地址 - 可选
   */

  /**
   * 获取实时天气情况
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/now
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
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/forecast15days
   */
  async forecast15Days() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.forecast15Days(cityId)
  }

  /**
   * 获取生活指数
   * @since 2021-02-07
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/liveindex
   */
  async liveIndex() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const list = await service.weather.liveIndex(cityId)
    ctx.body = {
      list,
    }
  }

  /**
   * 获取空气质量指数
   * @since 2021-02-07
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/aqi
   */
  async aqi() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.aqi(cityId)
  }

  /**
   * 获取空气质量指数 5 天预报
   * @since 2021-02-07
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/aqi5days
   */
  async aqi5Days() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const list = await service.weather.aqi5Days(cityId)
    ctx.body = {
      list,
    }
  }

  /**
   * 获取 24 小时天气预报
   * @since 2021-02-08
   * @update 2021-02-20
   *
   * method   =>    GET
   * path     =>    /weather/forecast24hours
   */
  async forecast24Hours() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const res = await service.weather.forecast24Hours(cityId)
    ctx.body = res
  }
}

module.exports = WeatherController
