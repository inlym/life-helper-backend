'use strict'

const { Controller } = require('egg')

class WeatherController extends Controller {
  /**
   * @api {get} /weather/now GET /weather/now
   * @apiName now
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取实时天气情况
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async now() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('id')
    ctx.body = await service.weather.weatherNow(location)
  }

  /**
   * @api {get} /weather/airnow GET /weather/airnow
   * @apiName airnow
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取实时空气质量
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async airnow() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('location')
    const { now } = await service.hefeng.airNow(location)
    ctx.body = now
  }

  /**
   * @api {get} /weather/15d GET /weather/15d
   * @apiName fore15d
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取未来 15 天预报
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async fore15d() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('id')
    const list = await service.weather.dailyForecast(location, '15d')
    ctx.body = {
      list,
    }
  }

  /**
   * @api {get} /weather/7d GET /weather/7d
   * @apiName fore7d
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取未来 7 天预报
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async fore7d() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('id')
    const list = await service.weather.dailyForecast(location, '7d')
    ctx.body = {
      list,
    }
  }

  /**
   * @api {get} /weather/24h GET /weather/24h
   * @apiName fore24h
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取未来 24 小时预报
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async fore24h() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('id')
    const list = await service.weather.hourlyForecast(location, '24h')
    ctx.body = {
      list,
    }
  }

  /**
   * @api {get} /weather/rain GET /weather/rain
   * @apiName minutelyRain
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取分钟级降水信息
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async minutelyRain() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('location')
    ctx.body = await service.weather.minutelyRain(location)
  }

  /**
   * @api {get} /weather/index GET /weather/index
   * @apiName index
   * @apiGroup weather
   * @apiVersion 0.9.0
   * @apiDescription 获取实时天气生活指数
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async index() {
    const { ctx, service } = this
    const location = await service.hefeng.handleControllerParams('id')
    const list = await service.weather.index(location)
    ctx.body = { list }
  }
}

module.exports = WeatherController
