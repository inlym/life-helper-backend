'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/moji.js', () => {
  it('fetchByLocation - 直接调一遍墨迹天气（经纬度版）的所有接口，接口都没挂', async () => {
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

  it('getByLocation- 从 Redis 中查询信息', async () => {
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

  it('fetchByCityId - 直接调一遍墨迹天气（城市ID版）的所有接口，接口都没挂', async () => {
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

  it('getByCityId - 从 Redis 中查询信息', async () => {
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

  it('queryCityId - 预设几个省市区测试返回值应和预设值对应', async () => {
    const ctx = app.mockContext()

    const list = [
      {
        id: 284873,
        province: '浙江省',
        city: '杭州市',
        district: '西湖区',
      },
      {
        id: 3,
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
      },
      {
        id: 1209,
        province: '浙江省',
        city: '宁波市',
        district: '鄞州区',
      },
    ]

    const promises = []
    for (let i = 0; i < list.length; i++) {
      const { province, city, district } = list[i]
      promises.push(ctx.service.moji.queryCityId(province, city, district))
    }
    const result = await Promise.all(promises)
    for (let i = 0; i < list.length; i++) {
      assert(list[i]['id'] === result[i])
    }
  })

  it('getCityId - 根据省市区获取 cityId', async () => {
    const ctx = app.mockContext()

    /** 测试用的省市区信息 */
    const obj = {
      id: 284873,
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const cityId = await ctx.service.moji.getCityId(obj)
    assert(cityId === obj.id)
  })

  it('getCityId - 根据经纬度获取 cityId', async () => {
    const ctx = app.mockContext()

    /** 测试用的经纬度信息 */
    const obj = {
      id: 284873,
      longitude: 120.11111,
      latitude: 30.11111,
    }

    const cityId = await ctx.service.moji.getCityId(obj)
    assert(cityId === obj.id)
  })

  it('getCityId - 根据请求者 IP 获取 cityId', async () => {
    const ctx = app.mockContext()

    /** 测试用的 IP 地址 */
    const obj = {
      id: 284873,
      ip: '183.156.98.100',
    }

    const cityId = await ctx.service.moji.getCityId(obj)
    assert(cityId === obj.id)
  })
})
