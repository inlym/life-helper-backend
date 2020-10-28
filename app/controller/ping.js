'use strict'

const { Controller } = require('egg')

class PingController extends Controller {
	async index() {
		this.ctx.body = 'pong'
	}

	async redis() {
		this.ctx.body = await this.app.redis.incr('system:ping_count')
	}

	async mysql() {
		const [results, metadata] = await this.app.model.query(
			'SELECT 1+1 as sum;'
		)

		// 返回结果应为 2
		this.ctx.body = results[0]['sum']
	}
}

module.exports = PingController
