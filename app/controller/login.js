'use strict'

const { wxLogin } = require('../service/auth')

/**
 * 小程序登录接口
 *
 * method => GET
 * query
 * 		- code
 * body   => null
 */
async function login(ctx, nextMiddleware) {
	const code = ctx.query.code
	ctx.body = await wxLogin(code)

	await nextMiddleware()
}

module.exports = {
	login,
}
