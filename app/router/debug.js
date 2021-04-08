'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 接口调试，原样返回请求信息 */
  router.all('/debug', controller.debug.index)

  /** 内部调试接口，用于查看登录鉴权信息 */
  router.all('/debug/auth', controller.debug.auth)

  /** 查看系统运行状态 */
  router.get('/status', controller.system.status)

  /** 查看请求日志 */
  router.get('/request/:id', controller.debug.request)

  /** 查看报错信息 */
  router.get('/debug/throw', controller.debug.throwError)

  /** 临时测试使用 */
  router.all('/debug/temp', controller.debug.temp)
}
