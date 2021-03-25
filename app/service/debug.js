'use strict'

const { Service } = require('egg')
const only = require('only')

/**
 * 当前文件存放用于调试的相关方法
 */
class DebugService extends Service {
  /**
   * 获取请求相关信息
   * @tag [Controller]
   * @description
   * 1. 当前方法直接操作控制器
   */
  getRequestDetail() {
    const { ctx } = this
    const props = [
      'method',
      'url',
      'headers',
      'origin',
      'href',
      'originalUrl',
      'path',
      'querystring',
      'search',
      'host',
      'hostname',
      'type',
      'charset',
      'query',
      'protocol',
      'secure',
      'ip',
      'ips',
      'subdomains',
      'rawBody',
      'body',
      'params',
    ]

    return only(ctx.request, props)
  }

  /**
   * 获取响应相关信息
   * @tag [Controller]
   * @description
   * 1. 当前方法直接操作控制器
   */
  getResponseDetail() {
    const { ctx } = this
    const props = ['headers', 'status', 'message', 'length', 'body', 'type']
    return only(ctx.response, props)
  }
}

module.exports = DebugService
