'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('redis 连接测试', () => {
	it('redis ping, return pong', async () => {
		const res = await app.redis.ping()
		assert(res === 'PONG')
	})
})
