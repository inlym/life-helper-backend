'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/mp.js', () => {
	it('小程序开发者ID和密钥正确(使用假的code调用返回错误码40029)', async () => {
		const ctx = app.mockContext()
		const fakeCode = 'abc'
		const res = await ctx.service.mp.code2Session(fakeCode)

		assert(res.errcode === 40029)
	})

	it('正常获取服务端的access_token', async () => {
		const ctx = app.mockContext()

		const res = await ctx.service.mp.getAccessToken()
		console.log(`    [sample] 获取的access_token为 => ${res.access_token}`)

		assert(!res.errcode)
		assert(typeof res.access_token === 'string')
	})
})
