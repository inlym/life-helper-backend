'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/queryhandler.js', () => {
  it('handleCityIdQueries - 使用省市区信息测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      region: '浙江省,杭州市,西湖区',
    }

    const obj = {
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(obj))
  })

  it('handleCityIdQueries - 使用经纬度信息测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.query = {
      location: '120.11111,30.11111',
    }

    const obj = {
      longitude: '120.11111',
      latitude: '30.11111',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(obj))
  })

  it('handleCityIdQueries - 不传入省市区和经纬度信息，使用请求者 IP 地址测试，返回结果正确', async () => {
    const ctx = app.mockContext()

    ctx.ip = '1.1.1.1'

    const obj = {
      ip: '1.1.1.1',
    }

    const result = ctx.service.queryhandler.handleCityIdQueries(ctx)
    assert(JSON.stringify(result) === JSON.stringify(obj))
  })
})
