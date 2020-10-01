'use strict'

/**
 * 客户端获取自己的IP地址
 *
 * method => GET
 * query  => null
 * body   => null
 */
async function getIp(ctx, nextMiddleware) {
	ctx.body = {
		ip: ctx.ip,
	}

	await nextMiddleware()
}

module.exports = {
	getIp,
}
