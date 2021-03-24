'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取客户端直传 OSS 所需的凭证信息 */
  router.get('/oss/token', controller.oss.token)

  /** 接受 OSS 回调 */
  router.post('/oss/callback', controller.oss.callback)
}
