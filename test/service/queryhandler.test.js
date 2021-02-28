'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/queryhandler.js', () => {
  it('handleCityIdQueries - 使用省市区参数测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const expectation = {
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(expectation))
  })

  it('handleCityIdQueries - 使用省市区组合的 region 参数测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      region: '浙江省,杭州市,西湖区',
    }

    const expectation = {
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(expectation))
  })

  it('handleCityIdQueries - 使用经纬度参数测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      longitude: '120.11111',
      latitude: '30.11111',
    }

    const expectation = {
      longitude: '120.11111',
      latitude: '30.11111',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(expectation))
  })

  it('handleCityIdQueries - 使用经纬度组合的 location 参数测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      location: '120.11111,30.11111',
    }

    const expectation = {
      longitude: '120.11111',
      latitude: '30.11111',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(expectation))
  })

  it('handleCityIdQueries - 不传入省市区和经纬度信息，使用请求者 IP 地址测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.ip = '1.1.1.1'

    const expectation = {
      ip: '1.1.1.1',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(expectation))
  })
})
