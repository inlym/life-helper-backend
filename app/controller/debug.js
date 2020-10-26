'use strict'

const { Controller } = require('egg')
const only = require('only')

class DebugController extends Controller {
	async index() {
		const { ctx } = this

		const fields = [
			'headers',
			'url',
			'origin',
			'href',
			'method',
			'path',
			'query',
			'querystring',
			'search',
			'host',
			'hostname',
			'protocol',
			'secure',
			'ips',
			'ip',
			'subdomains',
			'body',
			'rawBody',
			'params',
		]
		ctx.body = only(ctx.request, fields)
	}

	async redirect() {
		const { ctx } = this
		ctx.redirect('http://inlym.com')
	}

	async seq() {
		const { ctx, app } = this
		const res = await app.model.User.findAll({
			attributes: ['id', 'tip'],
		})
		ctx.body = res
	}

	async temp() {
		const { ctx } = this
		ctx.body = 'hello'
	}
}

module.exports = DebugController
