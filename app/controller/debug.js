'use strict'

const { Controller } = require('egg')
const only = require('only')

class DebugController extends Controller {
  async index() {
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

    this.ctx.body = only(this.ctx.request, requestFields)
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

  env() {
    const envFields = ['NODE_ENV', 'EGG_SERVER_ENV']
    this.ctx.body = {
      'process.env': only(process.env, envFields),
      'app.config.env': this.app.config.env,
    }
  }

  os() {
    this.ctx.body = {
      node_version: process.version,
      pid: process.pid,
      ppid: process.ppid,
      platform: process.platform,
      listen_port: this.app.config.cluster.listen.port,
    }
  }

  ip() {
    this.ctx.body = {
      ip: this.ctx.ip,
    }
  }
}

module.exports = DebugController
