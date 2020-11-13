'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('egg-redis', () => {
  it('Redis连接： 使用 ping 函数，返回 PONG', async () => {
    const res = await app.redis.ping()
    assert(res === 'PONG')
  })
})
