'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/location.js', () => {
  it('[腾讯位置服务接口] IP 定位', async () => {
    const ctx = app.mockContext()

    // 测试用的 IP 地址
    const ip = '114.114.114.114'

    const res = await ctx.service.location.fetchLocationByIp(ip)
    assert(res.ip === ip)
  })
})
