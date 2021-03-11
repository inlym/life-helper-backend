'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取实时天气情况 */
  router.get('/weather/now', controller.weather.now)

  /** 获取未来 15 天的天气预报 */
  router.get('/weather/forecast15days', controller.weather.forecast15Days)

  /** 获取生活指数 */
  router.get('/weather/liveindex', controller.weather.liveIndex)

  /** 获取空气质量指数 */
  router.get('/weather/aqi', controller.weather.aqi)

  /** 获取空气质量指数 5 天预报 */
  router.get('/weather/aqi5days', controller.weather.aqi5Days)

  /** 获取 24 小时天气预报 */
  router.get('/weather/forecast24hours', controller.weather.forecast24Hours)

  /** 获取今天和明天的天气情况 */
  router.get('/weather/forecast2days', controller.weather.forecast2Days)

  /** [和风天气] 获取实时空气质量 */
  router.get('/weather/airnow', controller.weather.airnow)

  /** [和风天气] 获取未来 15 天预报 */
  router.get('/weather/15d', controller.weather.fore15d)
}
