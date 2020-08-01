'use strict'

const { code2Session } = require('../app/service/mp-openid')
const { createTokenForSpecificUserId, getUserIdByToken, wxLogin } = require('../app/service/auth')
const { registerNewWxUser, getUserIdByOpenid } = require('../app/service/user')


async function login(ctx, next) {
	// 获取参数 code
	const code = ctx.query.code

	// 从微信服务器获取 openid
	const { openid } = await code2Session(code)

	// 获取 db 中的 userId (0表示不存在)
	const _userId = await getUserIdByOpenid(openid)
	let userId

	if (_userId) {
		userId = _userId
	} else {
		userId = await registerNewWxUser()

	}

	const token = await createTokenForSpecificUserId(userId)

	ctx.body = token
}


module.exports = {
	login,
}