'use strict'

const { app, assert } = require('egg-mock/bootstrap')

/** 测试用的 IP 地址 */
const ip = '114.114.114.114'

/** 测试用的经纬度 */
const longitude = 120.11111
const latitude = 30.22222

describe('service/location.js', () => {
  it('[腾讯位置服务接口] [IP 定位] [HTTP Request]', async () => {
    const ctx = app.mockContext()

    const res = await ctx.service.location.fetchLocationByIp(ip)
    assert(res.ip === ip)
  })

  it('[腾讯位置服务接口] [IP 定位] [Redis]', async () => {
    const ctx = app.mockContext()

    // 进行 2 次，保证至少有一次从 Redis 获取
    const res1 = await ctx.service.location.getLocationByIp(ip)
    const res2 = await ctx.service.location.getLocationByIp(ip)

    assert(JSON.stringify(res1) === JSON.stringify(res2))
  })

  it('[腾讯位置服务] [逆地址解析] [HTTP Request]', async () => {
    const ctx = app.mockContext()

    const res = await ctx.service.location.fetchAddressByLocation(longitude, latitude)
    assert(res.location.lat === latitude)
  })

  it('[腾讯位置服务] [逆地址解析] [Redis]', async () => {
    const ctx = app.mockContext()

    // 进行 2 次，保证至少有一次从 Redis 获取
    const res1 = await ctx.service.location.getAddressByLocation(longitude, latitude)
    const res2 = await ctx.service.location.getAddressByLocation(longitude, latitude)

    assert(JSON.stringify(res1) === JSON.stringify(res2))
  })
})
