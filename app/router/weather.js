'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** [和风天气] 获取实时天气情况 */
  router.get('/weather/now2', controller.weather.now)
  router.get('/weather/now', controller.weather.now)

  /** [和风天气] 获取实时空气质量 */
  router.get('/weather/airnow', controller.weather.airnow)

  /** [和风天气] 获取未来 15 天预报 */
  router.get('/weather/15d', controller.weather.fore15d)

  /** [和风天气] 获取未来 7 天预报 */
  router.get('/weather/7d', controller.weather.fore7d)

  /** [和风天气] 获取未来 24 小时预报 */
  router.get('/weather/24h', controller.weather.fore24h)

  /** [和风天气] 分钟级降水信息 */
  router.get('/weather/rain', controller.weather.minutelyRain)

  /** [和风天气] 获取天气生活指数 */
  router.get('/weather/index', controller.weather.index)
}
