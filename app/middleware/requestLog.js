'use strict'

/**
 * 简单实现一个够用的深拷贝
 * @param {object} obj 待拷贝的对象
 * @returns {object}
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 记录请求和响应日志
 * @param {object} options 中间件配置
 */
module.exports = () => {
  return async function requestLog(ctx, next) {
    // '/ping' 接口用于健康检查，无需所任何记录
    if (ctx.path !== '/ping') {
      const { app, service } = ctx
      const request = clone(service.debug.getRequestDetail())

      await next()

      const requestId = ctx.tracer.traceId
      const response = clone(service.debug.getResponseDetail())
      const data = JSON.stringify({ request, response })

      const { key: redisKey, timeout } = ctx.service.keys.requestLog(requestId)
      app.redis.set(redisKey, data, 'EX', timeout)

      const oss = app.oss.get('dataflow')
      oss.put('/request-log/' + requestId + '.json', Buffer.from(data))
    } else {
      await next()
    }
  }
}
