'use strict'

const { Controller } = require('egg')

class WxserverController extends Controller {
  /**
   * 用于接收由微信服务器发送的消息推送
   */
  async getMessagePush() {
    const { ctx, logger } = this
    logger.info(
      '微信服务器消息推送 query =>',
      JSON.stringify(ctx.query),
      'request body =>',
      JSON.stringify(ctx.request.body)
    )

    ctx.body = ctx.query.echostr
  }
}

module.exports = WxserverController
