'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 用于接收由微信服务器发送的消息推送 */
  router.get('/wxserver/message', controller.wxserver.getMessagePush)
  router.post('/wxserver/message', controller.wxserver.getMessagePush)
}
