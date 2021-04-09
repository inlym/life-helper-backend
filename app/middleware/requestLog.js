'use strict'

/**
 * 记录请求和响应日志
 * @param {object} options 中间件配置
 */

module.exports = () => {
  return async function requestLog(ctx, next) {
    // '/ping' 接口用于健康检查，无需所任何记录
    if (ctx.path !== '/ping') {
      const { app, service } = ctx
      const request = JSON.stringify(service.debug.getRequestDetail())

      await next()

      const requestId = ctx.tracer.traceId
      const response = JSON.stringify(service.debug.getResponseDetail())
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
