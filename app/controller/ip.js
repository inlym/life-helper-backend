'use strict'

const { Controller } = require('egg')

class IpController extends Controller {
	async index() {
		const { ctx } = this
		ctx.body = ctx.ip
	}
}

module.exports = IpController
