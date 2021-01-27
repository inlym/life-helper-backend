'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取实时天气情况 */
  router.get('/weather/now', controller.weather.realtime)
}
