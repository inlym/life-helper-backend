'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /**
   * 接口分类：
   * - 非业务层接口
   *   - [ping] 系列接口用于检测应用各模块的状态（是否正常运行）
   *   - [debug] 系列接口用于调试，查看应用状态信息
   * - 业务层接口
   */

  /** 用于检测应用是否正常运行 */
  router.get('/ping', controller.ping.index)

  /** 用于检测 Redis 服务是否正常运行 */
  router.get('/ping/redis', controller.ping.redis)

  /** 用于检测 MySQL 服务是否正常运行 */
  router.get('/ping/mysql', controller.ping.mysql)

  /** 用于检测 TableStore 服务是否正常运行 */
  router.get('/ping/ots', controller.ping.ots)

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

  /** 临时测试模板引擎功能 */
  router.get('/debug/tpl', controller.debug.tpl)

  /** 临时测试使用 */
  router.post('/test', controller.debug.test)

  /** 微信登录 */
  router.get('/login', controller.login.wxLogin)

  /** 查看系统运行状态 */
  router.get('/status', controller.system.status)
}
