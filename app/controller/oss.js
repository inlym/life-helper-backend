'use strict'

const { Controller } = require('egg')

/**
 * 当前控制器放置 OSS 相关服务
 */

class OssController extends Controller {
  /**
   * @api {get} /oss/token GET /oss/token
   * @apiName token
   * @apiGroup oss
   * @apiVersion 0.9.0
   * @apiDescription 获取客户端直传 OSS 的 token
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

  /**
   * @api {post} /oss/callback POST /oss/callback
   * @apiName callback
   * @apiGroup oss
   * @apiVersion 0.9.0
   * @apiDescription 非客户端接口，用于接收 OSS 回调
   */
  async callback() {
    const { ctx, service } = this
    const verifySignatureResult = await service.oss.verifyOssCallbackSignature()
    if (verifySignatureResult) {
      service.oss.handleOssCallback(ctx.request.body)
    }
    ctx.body = {
      errCode: 0,
    }
  }
}

module.exports = OssController
