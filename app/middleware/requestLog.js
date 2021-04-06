'use strict'

/**
 * 记录请求和响应日志
 * @param {object} options 中间件配置
 */

module.exports = () => {
  return async function requestLog(ctx, next) {
    await next()

    // '/ping' 接口用于健康检查，无需所任何记录
    if (ctx.path !== '/ping') {
      const { app, service } = ctx
      const requestId = ctx.tracer.traceId

      const message = {
        request: service.debug.getRequestDetail(),
        response: service.debug.getResponseDetail(),
      }

      const data = JSON.stringify(message)

      const { key: redisKey, timeout } = ctx.service.keys.requestLog(requestId)
      app.redis.set(redisKey, data, 'EX', timeout)

      const oss = app.oss.get('dataflow')
      oss.put('/request-log/' + requestId + '.json', Buffer.from(data))
    }
  }
}
