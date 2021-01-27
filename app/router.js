'use strict'

module.exports = (app) => {
  const { router, controller } = app

  require('./router/debug.js')(app)
  require('./router/ping.js')(app)
  require('./router/login.js')(app)
  require('./router/user.js')(app)

  /** 临时测试使用 */
  router.post('/test', controller.debug.test)

  /** 查看系统运行状态 */
  router.get('/status', controller.system.status)
}
