'use strict'

const { Controller } = require('egg')

class PingController extends Controller {
	/**
	 * @description 用于负载均衡健康检查
	 */
	async index() {
		this.ctx.body = 'pong'
	}

	async redis() {
		this.ctx.body = await this.app.redis.incr('system:ping_count')
	}
}

module.exports = PingController
