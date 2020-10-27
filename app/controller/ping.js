'use strict'

const { Controller } = require('egg')

class PingController extends Controller {
	async index() {
		this.ctx.body = 'pong'
	}

	async redis() {
		this.ctx.body = await this.app.redis.incr('system:ping_count')
	}
}

module.exports = PingController
