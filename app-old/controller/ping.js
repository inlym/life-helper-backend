'use strict'

/**
 *  检测服务是否正常
 *
 *  ALL /ping
 */
async function ping(ctx, nextMiddleware) {
	ctx.body = 'pong'
	await nextMiddleware()
}

module.exports = {
	ping,
}
