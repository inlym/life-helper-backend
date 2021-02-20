'use strict'

const { Controller } = require('egg')
const only = require('only')
const sp = require('spawn-object')

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

  async debugLogger() {
    /**
     * 格式演示：
     * 2020-01-01 01:02:03,840 INFO 9999 [123/1.1.1.1/AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA/2ms GET /debug/logger] 这是 ctx.logger.debug 日志
     */
    this.ctx.logger.debug('这是 ctx.logger.debug 日志')
    this.ctx.logger.info('这是 ctx.logger.info 日志')
    this.ctx.logger.warn('这是 ctx.logger.warn 日志')
    this.ctx.logger.error('这是 ctx.logger.error 日志')

    /**
     * 格式演示：
     * 2020-01-01 01:02:03,840 INFO 9999 这是 app.logger.debug 日志
     */
    this.app.logger.debug('这是 app.logger.debug 日志')
    this.app.logger.info('这是 app.logger.info 日志')
    this.app.logger.warn('这是 app.logger.warn 日志')
    this.app.logger.error('这是 app.logger.error 日志')

    /**
     * 格式演示：
     * 2020-01-01 01:02:03,840 INFO 9999 [123/1.1.1.1/AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA/2ms GET /debug/logger] [controller.debug] 这是 logger.debug 日志
     */
    this.logger.debug('这是 logger.debug 日志')
    this.logger.info('这是 logger.info 日志')
    this.logger.warn('这是 logger.warn 日志')
    this.logger.error('这是 logger.error 日志')

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

  now() {
    this.ctx.body = {
      now: this.app.now(),
    }
  }

  test() {
    console.log('----  temp test  ----')
  }

  err() {
    throw new Error('自定义错误')
  }

  /**
   * 用于查看请求日志
   * @since 2021-02-20
   */
  async request() {
    const { app, ctx } = this
    const { ots } = app

    const { id } = ctx.params

    if (!id) {
      ctx.body = {}
      return
    }

    const params = {
      tableName: 'request_log',
      primaryKey: sp({ request_id: id }),
    }

    const res = await ots.getRow(params)

    const list = res.row.attributes

    const response = {}

    for (let i = 0; i < list.length; i++) {
      response[list[i]['columnName']] = list[i]['columnValue']
    }
    ctx.body = response
  }
}

module.exports = DebugController
