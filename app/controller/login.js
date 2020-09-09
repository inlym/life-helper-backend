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
async function login(ctx, next) {
	const code = ctx.query.code
	ctx.body = await wxLogin(code)

	await next()
}



module.exports = {
	login,
}
