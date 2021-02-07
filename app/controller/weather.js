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
   * @update 2021-02-07
   *
   * method   =>    GET
   * path     =>    /weather/forecast15days
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
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
   *
   * method   =>    GET
   * path     =>    /weather/forecast15days
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
   */
  async liveIndex() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const liveIndex = await service.weather.liveIndex(cityId)
    ctx.body = {
      liveIndex,
    }
  }
}

module.exports = WeatherController
