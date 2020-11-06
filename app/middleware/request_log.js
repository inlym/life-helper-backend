'use strict'

const sp = require('spawn-object')

/**
 *  记录请求和响应日志
 * @param {object} options 中间件配置
 */

module.exports = () => {
	return async function requestLog(ctx, next) {
		await next()
		const { app } = ctx

		const { url, method, path, querystring, host, ip } = app.only(
			ctx.request,
			'url method path querystring host ip'
		)

		const request_headers = ctx.request.headers
		const request_body = ctx.request.rawBody || ''
		const { status } = ctx.response
		const response_headers = ctx.response.headers
		const response_body = ctx.response.body
		const create_time = app.dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
		console.log('create_time: ', create_time)

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

		const { TableStore, ots } = app

		const params = {
			tableName: 'request_log',
			condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
			primaryKey: sp({ request_id: ctx.tracer.traceId }),
			attributeColumns: sp(obj),
			returnContent: { returnType: TableStore.ReturnType.Primarykey },
		}

		ots.putRow(params)
	}
}
