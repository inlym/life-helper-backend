'use strict'

async function ping(ctx, next) {
	ctx.body = 'pong'
	await next()
}

module.exports = {
	ping,
}
