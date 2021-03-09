'use strict'

module.exports = (app) => {
  // 记录本次启动时间
  app.redis.set('system:lastLaunchTime', app.now())

  // 记录启动次数 +1
  app.redis.incr('system:launchCounter')
}
