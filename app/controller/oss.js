'use strict'

const { Controller } = require('egg')

/**
 * 当前控制器放置 OSS 相关服务
 */

class OssController extends Controller {
  /**
   * @api {get} /oss/token 获取 OSS 直传凭证
   * @apiName token
   * @apiGroup oss
   * @apiVersion v1
   */
  async token() {
    const { ctx, service } = this
    const { n } = ctx.query
    const num = parseInt(n, 10) || 1
    if (num >= 1 && num <= 10) {
      const list = []
      for (let i = 0; i < num; i++) {
        list.push(service.oss.generateClientToken())
      }
      ctx.body = { list }
    }
  }

  async callback() {
    const { ctx, service } = this
    service.oss.listenOssCallback({
      method: ctx.method,
      url: ctx.request.url,
      headers: ctx.request.headers,
      body: ctx.request.body,
    })
  }
}

module.exports = OssController
