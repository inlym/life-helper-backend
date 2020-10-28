'use strict'

const { Controller } = require('egg')
const only = require('only')

class DebugController extends Controller {
	async index() {
		const { ctx, app } = this

		const requestFields = [
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
			'length',
			'protocol',
			'secure',
			'ips',
			'ip',
			'subdomains',
			'type',
			'body',
			'rawBody',
			'params',
		]

		const envFields = ['NODE_ENV', 'EGG_SERVER_ENV', 'HOME', 'OS', 'PWD']
		const processFields = ['version', 'pid', 'ppid', 'arch', 'platform']
		const appConfigFields = ['env', 'name', 'baseDir', 'HOME', 'cluster']

		const request = only(ctx.request, requestFields)
		const process_env = only(process.env, envFields)
		const app_config = only(app.config, appConfigFields)

		const res = {
			request,
			process_env,
			app_config,
			process: only(process, processFields),
		}

		ctx.body = res
	}

	async logger() {
		this.ctx.logger.debug('这是 ctx.logger.debug 日志')
		this.ctx.logger.info('这是 ctx.logger.info 日志')
		this.ctx.logger.warn('这是 ctx.logger.warn 日志')
		this.ctx.logger.error('这是 ctx.logger.error 日志')

		this.app.logger.debug('这是 app.logger.debug 日志')
		this.app.logger.info('这是 app.logger.info 日志')
		this.app.logger.warn('这是 app.logger.warn 日志')
		this.app.logger.error('这是 app.logger.error 日志')

		this.ctx.body = 'ok'
	}
}

module.exports = DebugController
