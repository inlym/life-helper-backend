'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 用于检测应用是否正常运行 */
  router.get('/ping', controller.ping.index)

  /** 用于生成指定位数的随机字符串 */
  router.get('/ping/string', controller.ping.string)

  /** 用于检测 Redis 服务是否正常运行 */
  router.get('/ping/redis', controller.ping.redis)

  /** 用于检测 MySQL 服务是否正常运行 */
  router.get('/ping/mysql', controller.ping.mysql)

  /** 用于检测 TableStore 服务是否正常运行 */
  router.get('/ping/ots', controller.ping.ots)
}
