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
   * @apiParamExample {json} Query
   * {
   *   region: '浙江省,杭州市,西湖区',
   *   location: '120.11111,30.11111',
   *   province: '浙江省',
   *   city: '杭州市',
   *   district: '西湖区',
   *   longitude: 120.11111,
   *   latitude: 30.11111,
   * }
   *
   * @apiDescription
   * ``` sh
   * 1. 所有参数都可以不传，服务端会使用客户端的请求者 IP 来定位。
   * 2. province, city, district 3个参数如果传递必须一起传递，缺一不可。
   * 3. longitude, latitude 2个参数如果传递必须一起传递，缺一不可。
   * 4. region 参数是 province, city, district 3个参数的缩略形式，不要同时传递。
   * 5. location 参数是 longitude, latitude 2个参数的缩略形式，不要同时传递。
   * ```
   */

  /**
   * @api {get} /weather/now 获取实时天气情况
   * @apiName now
   * @apiGroup 天气
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
   *
   * @apiSuccessExample {json} 返回值示例
   * {
   *   "condition":"阴",
   *   "temperature":"12",
   *   "sensibleTemperature":"10",
   *   "airPressure":"1024",
   *   "humidity":"93",
   *   "ultraviolet":"1",
   *   "visibility":"21370",
   *   "windDirection":"北风",
   *   "windScale":"3",
   *   "windSpeed":"4.8",
   *   "tip":"今天有雨，天冷了，该加衣服了！",
   *   "iconUrl":"/app/static/image/weather_icon/2.png",
   *   "sunrise":"6:26",
   *   "sunset":"17:58"
   * }
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
   * @apiGroup 天气
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
   * @apiGroup 天气
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
   * @apiGroup 天气
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
   * @apiGroup 天气
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
   * @apiGroup 天气
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

  /**
   * @api {get} /weather/forecast2days 获取今天和明天两天的天气情况
   * @apiName forecast2Days
   * @apiGroup 天气
   * @apiVersion 0.1.0
   *
   * @apiUse WeatherCommonQuery
   *
   * @apiSuccess (Response) {String} max 最高温度
   * @apiSuccess (Response) {String} min 最低温度
   * @apiSuccess (Response) {String} iconUrl icon 图标的 URL
   * @apiSuccess (Response) {String} desc 天气转变情况描述
   * @apiSuccess (Response) {String} aqiClass 空气质量指数等级描述
   * @apiSuccess (Response) {String} aqiClass 显示 aqi 等级的背景色
   *
   * @apiSuccessExample {json} 返回值示例
   * {
   *   list: [
   *     {
   *       max: '16',
   *       min: '9',
   *       iconUrl: '/app/static/image/weather_icon/7.png',
   *       desc: '小到中雨转中雨',
   *       aqiClass: '优',
   *       aqiColor: '#00E400'
   *     },
   *     ...
   *   ]
   * }
   */
  async forecast2Days() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    const cityId = await service.moji.getCityId(options)
    const list = await service.weather.forecast2Days(cityId)
    ctx.body = {
      list,
    }
  }

  /**
   * @api {get} /weather/airnow 获取实时空气质量
   * @apiName airnow
   * @apiGroup 天气
   *
   * @description 使用 [和风天气] API
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async airnow() {
    const { ctx, service } = this
    const { location } = ctx.query

    if (location) {
      const [longitude, latitude] = location.split(',')
      if (longitude && latitude) {
        ctx.body = await service.hefeng.airNow(longitude, latitude)
      }
    } else {
      const { longitude, latitude } = await service.location.getCoordByIp(ctx.ip)
      ctx.body = await service.hefeng.airNow(longitude, latitude)
    }
  }

  /**
   * @api {get} /weather/15d 获取未来 15 天预报
   * @apiName fore15d
   * @apiGroup 天气
   * @apiVersion 1.0
   *
   * @description 使用 [和风天气] API
   *
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   */
  async fore15d() {
    const { ctx, service } = this
    const { location } = ctx.query

    let longitude = ''
    let latitude = ''

    if (location) {
      const [lng, lat] = location.split(',')
      if (lng && lat) {
        longitude = lng
        latitude = lat
      }
    } else {
      const coord = await service.location.getCoordByIp(ctx.ip)
      longitude = coord.longitude
      latitude = coord.latitude
    }

    const locationId = await service.hefeng.getLocationId(longitude, latitude)
    const list15d = await service.weather.fore15d(locationId)
    ctx.body = {
      list: list15d,
    }
  }
}

module.exports = WeatherController
