'use strict'

module.exports = {
  schedule: {
    interval: '1s',
    type: 'all',
  },

  async task(ctx) {
    await ctx.app.redis.incr('ping_redis_schedule')
  },
}
