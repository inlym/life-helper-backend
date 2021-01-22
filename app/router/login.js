'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 微信登录 */
  router.get('/login', controller.login.wxLogin)
}
