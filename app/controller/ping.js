'use strict'

const { Controller } = require('egg')

class PingController extends Controller {
	async index() {
		this.ctx.body = 'pong'
	}
}

module.exports = PingController
