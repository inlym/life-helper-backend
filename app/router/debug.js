'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 接口调试，原样返回请求信息 */
  router.all('/debug', controller.debug.index)

  /** 查看系统运行状态 */
  router.get('/status', controller.system.status)

  /** 查看请求日志 */
  router.get('/request/:id', controller.debug.request)
}
