'use strict'

const sp = require('spawn-object')

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

      const { url, method, path, querystring, host, ip } = app.only(ctx.request, 'url method path querystring host ip')

      const request_headers = ctx.request.headers
      const request_body = ctx.request.rawBody || ''
      const { status } = ctx.response
      const response_headers = ctx.response.headers
      const response_body = ctx.response.body
      const create_time = app.now()

      const obj = {
        url,
        method,
        path,
        querystring,
        host,
        ip,
        request_headers,
        request_body,
        status,
        response_headers,
        response_body,
        create_time,
      }

      const { key: redisKey, timeout } = ctx.service.keys.requestLog(requestId)
      app.redis.set(
        redisKey,
        JSON.stringify({
          request: service.debug.getRequestDetail(),
          response: service.debug.getResponseDetail(),
        }),
        'EX',
        timeout
      )

      const { TableStore, ots } = app

      const params = {
        tableName: 'request_log',
        condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
        primaryKey: sp({ request_id: requestId }),
        attributeColumns: sp(obj),
        returnContent: { returnType: TableStore.ReturnType.Primarykey },
      }

      ots.putRow(params)
    }
  }
}
