'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/moji.js', () => {
  it('[墨迹天气] 通过经纬度查询信息', async () => {
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
})
