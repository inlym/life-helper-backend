'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('controller/ping.js', () => {
	describe('[index]  GET /ping', () => {
		it('状态码 => 200 - 响应body => pong', () => {
			return app.httpRequest().get('/ping').expect(200).expect('pong')
		})
	})

	describe('[redis]  GET /ping/redis', () => {
		it('状态码 => 200 - 响应body => 正整数', async () => {
			const res = await app.httpRequest().get('/ping/redis').expect(200)
			assert(typeof res.body === 'number')
		})
	})

	describe('[mysql]  GET /ping/mysql', () => {
		it('状态码 => 200 - 响应body => 2', async () => {
			const res = await app.httpRequest().get('/ping/mysql').expect(200)
			assert(typeof res.body === 'number')
			assert(res.body === 2)
		})
	})
})
