'use strict'

module.exports = {
  schedule: {
    interval: '1ms',
    type: 'worker',
  },

  async task(ctx) {
    await ctx.app.redis.incr('ping_redis_schedule')
  },
}
