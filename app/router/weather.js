'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取实时天气情况 */
  router.get('/weather/now', controller.weather.now)

  /** 获取未来 15 天的天气预报 */
  router.get('/weather/forecast15days', controller.weather.forecast15Days)
}
