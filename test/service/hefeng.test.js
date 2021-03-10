'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/hefeng.js', () => {
  it('getCityId - 使用给定的经纬度调用2次，两次返回结果均正确', async () => {
    const ctx = app.mockContext()

    // 测试用的经纬度
    const longitude = 120.121033
    const latitude = 30.28161

    /** 预期结果 */
    const expectation = '101210113'

    const res1 = await ctx.service.hefeng.getCityId(longitude, latitude)
    const res2 = await ctx.service.hefeng.getCityId(longitude, latitude)
    assert(res1 === expectation)
    assert(res2 === expectation)
  })
})
