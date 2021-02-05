'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/moji.js', () => {
  it('[墨迹天气] [经纬度] 调接口查询信息', async () => {
    const ctx = app.mockContext()

    // 测试用的经纬度
    const longitude = '120.130'
    const latitude = '30.259'

    /** 获取 api 列表 */
    const apis = ctx.service.moji.apis()

    const promises = []

    for (let i = 0; i < apis.length; i++) {
      promises.push(ctx.service.moji.fetchByLocation(apis[i], longitude, latitude))
    }

    const result = await Promise.all(promises)

    assert(apis.length === result.length)
  })

  it('[墨迹天气] [经纬度] 从 Redis 中查询信息', async () => {
    const ctx = app.mockContext()

    // 测试用的经纬度
    const longitude = '120.130'
    const latitude = '30.259'

    /** 获取 api 列表 */
    const apis = ctx.service.moji.apis()

    const promises = []

    for (let i = 0; i < apis.length; i++) {
      promises.push(ctx.service.moji.getByLocation(apis[i], longitude, latitude))
    }

    const result = await Promise.all(promises)

    assert(apis.length === result.length)
  })

  it('[墨迹天气] [城市ID] 调接口查询信息', async () => {
    const ctx = app.mockContext()

    // 测试用的城市 ID
    const cityId = 284873

    /** 获取 api 列表 */
    const apis = ctx.service.moji.apis()

    const promises = []

    for (let i = 0; i < apis.length; i++) {
      promises.push(ctx.service.moji.fetchByCityId(apis[i], cityId))
    }

    const result = await Promise.all(promises)

    assert(apis.length === result.length)
  })

  it('[墨迹天气] [城市ID] 从 Redis 中查询信息', async () => {
    const ctx = app.mockContext()

    // 测试用的城市 ID
    const cityId = 284873

    /** 获取 api 列表 */
    const apis = ctx.service.moji.apis()

    const promises = []

    for (let i = 0; i < apis.length; i++) {
      promises.push(ctx.service.moji.getByCityId(apis[i], cityId))
    }

    const result = await Promise.all(promises)

    assert(apis.length === result.length)
  })
})
