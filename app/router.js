'use strict'

module.exports = (app) => {
  const { router, controller } = app

  require('./router/debug.js')(app)
  require('./router/ping.js')(app)
  require('./router/login.js')(app)
  require('./router/user.js')(app)
  require('./router/weather.js')(app)
  require('./router/location.js')(app)
  require('./router/image.js')(app)

  /** 查看系统运行状态 */
  router.get('/status', controller.system.status)
}
