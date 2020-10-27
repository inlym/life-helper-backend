'use strict'

const { Controller } = require('egg')

class PingController extends Controller {
	constructor(ctx) {
		super(ctx)
		this.cusName = ctx.get('User-Agent')
	}

	async index() {
		this.ctx.body = this.cusName
	}

	async redis() {
		this.ctx.body = await this.app.redis.incr('system:ping_count')
	}
}

module.exports = PingController
