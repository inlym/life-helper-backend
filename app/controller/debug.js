'use strict'

const { Controller } = require('egg')
const only = require('only')

class DebugController extends Controller {
  async index() {
    const { ctx } = this

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

    ctx.body = only(ctx.request, requestFields)
  }

  async logger() {
    const { ctx, app } = this
    ctx.logger.debug('这是 ctx.logger.debug 日志')
    ctx.logger.info('这是 ctx.logger.info 日志')
    ctx.logger.warn('这是 ctx.logger.warn 日志')
    ctx.logger.error('这是 ctx.logger.error 日志')

    app.logger.debug('这是 app.logger.debug 日志')
    app.logger.info('这是 app.logger.info 日志')
    app.logger.warn('这是 app.logger.warn 日志')
    app.logger.error('这是 app.logger.error 日志')

    ctx.body = 'ok'
  }

  env() {
    const { ctx, app } = this
    const envFields = ['NODE_ENV', 'EGG_SERVER_ENV']
    ctx.body = {
      'process.env': only(process.env, envFields),
      'app.config.env': app.config.env,
    }
  }

  os() {
    const { ctx, app } = this
    ctx.body = {
      node_version: process.version,
      pid: process.pid,
      ppid: process.ppid,
      platform: process.platform,
      listen_port: app.config.cluster.listen.port,
    }
  }
}

module.exports = DebugController
