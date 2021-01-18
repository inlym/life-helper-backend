'use strict'

/**
 * 定时任务：
 * 每小时更新一次微信服务端的接口调用凭证
 */

module.exports = {
  schedule: {
    interval: '1h',
    type: 'worker',
  },

  async task(ctx) {
    await ctx.service.mp.updateAccessToken()
  },
}
