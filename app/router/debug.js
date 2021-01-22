'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 接口调试，原样返回请求信息 */
  router.all('/debug', controller.debug.index)

  /** 调试框架的日志功能，调用接口打印日志 */
  router.get('/debug/logger', controller.debug.debugLogger)

  /** 查看应用的环境变量：NODE_ENV, EGG_SERVER_ENV, app.config.env */
  router.get('/debug/env', controller.debug.env)

  /** 查看应用的系统信息：node_version, pid, platform, listen_port */
  router.get('/debug/os', controller.debug.os)

  /** 查看客户端的 IPv4 地址 */
  router.get('/debug/ip', controller.debug.ip)

  /** 控制器内抛出错误 */
  router.get('/debug/error', controller.debug.err)

  /** 获取当前服务器时间 */
  router.get('/debug/now', controller.debug.now)
}
