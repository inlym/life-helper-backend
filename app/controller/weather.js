'use strict'

const { Controller } = require('egg')

class WeatherController extends Controller {
  /**
   * @apiDefine WeatherCommonQuery
   * @apiParam (Query) {String} [region] 区域，格式：`region=${province},${city},${district}`
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   * @apiParam (Query) {String} [province] 省份
   * @apiParam (Query) {String} [city] 城市
   * @apiParam (Query) {String} [district] 区县
   * @apiParam (Query) {Number} [longitude] 经度
   * @apiParam (Query) {Number} [latitude] 经度
   *
   */

  /**
   * @api {get} /weather/now 获取实时天气情况
   * @apiName now
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
   *
   * @apiSuccess (Response) {String} airPressure 气压
   * @apiSuccess (Response) {String} condition 实时天气
   * @apiSuccess (Response) {String} humidity 湿度
   * @apiSuccess (Response) {String} iconUrl 天气icon图标地址
   * @apiSuccess (Response) {String} sensibleTemperature 体感温度
   * @apiSuccess (Response) {String} sunrise 日出时间
   * @apiSuccess (Response) {String} sunset 日落时间
   * @apiSuccess (Response) {String} temperature 温度
   * @apiSuccess (Response) {String} tip 一句话提示
   * @apiSuccess (Response) {String} ultraviolet 紫外线强度
   * @apiSuccess (Response) {String} visibility 能见度
   * @apiSuccess (Response) {String} windDirection 风向
   * @apiSuccess (Response) {String} windScale 风级
   * @apiSuccess (Response) {String} windSpeed 风速
   */
  async now() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.condition(cityId)
  }

  /**
   * @api {get} /weather/forecast15days 获取未来 15 天的天气预报
   * @apiName forecast15Days
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
   */
  async forecast15Days() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.forecast15Days(cityId)
  }

  /**
   * @api {get} /weather/liveindex 获取生活指数
   * @apiName liveIndex
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
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
   * @api {get} /weather/aqi 获取生活指数
   * @apiName aqi
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
   */
  async aqi() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    ctx.body = await service.weather.aqi(cityId)
  }

  /**
   * @api {get} /weather/aqi5days 获取空气质量指数 5 天预报
   * @apiName aqi
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
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
   * @api {get} /weather/forecast24hours 获取 24 小时天气预报
   * @apiName forecast24Hours
   * @apiGroup weather
   * @apiVersion 0.0.3
   *
   * @apiUse WeatherCommonQuery
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
