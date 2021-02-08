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
    const promises = []
    promises.push(service.moji.getCityId(options))
    promises.push(service.location.getAddressDescription(options))

    const [cityId, address] = await Promise.all(promises)

    const response = await service.weather.condition(cityId)

    response.address = address

    ctx.body = response
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
   * path     =>    /weather/liveindex
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
    const list = await service.weather.liveIndex(cityId)
    ctx.body = {
      list,
    }
  }

  /**
   * 获取空气质量指数
   * @since 2021-02-07
   *
   * method   =>    GET
   * path     =>    /weather/aqi
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
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
   *
   * method   =>    GET
   * path     =>    /weather/aqi5days
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
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
   *
   * method   =>    GET
   * path     =>    /weather/forecast24hours
   * query    =>    1. region - 省市区 - 可选
   *                2. location - 经纬度 - 可选
   * body     =>    null
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
   */
  async forecast24Hours() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const list = await service.weather.forecast24Hours(cityId)
    ctx.body = {
      list,
    }
  }
}

module.exports = WeatherController
