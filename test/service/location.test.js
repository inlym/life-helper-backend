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

  it('getAddressDescription - 根据省市区获取位置描述与预设值相同', async () => {
    const ctx = app.mockContext()

    /** 测试用的省市区信息 */
    const obj = {
      desc: '西湖区',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
    }

    const desc = await ctx.service.location.getAddressDescription(obj)
    assert(desc === obj.desc)
  })

  it('getAddressDescription - 根据经纬度获取位置描述与预设值相同', async () => {
    const ctx = app.mockContext()

    /** 测试用的经纬度信息 */
    const obj = {
      desc: '西湖区兰千桥西',
      longitude: 120.11111,
      latitude: 30.11111,
    }

    const desc = await ctx.service.location.getAddressDescription(obj)
    assert(desc === obj.desc)
  })

  it('getAddressDescription - 根据请求者 IP 获取位置描述是一个字符串', async () => {
    const ctx = app.mockContext()

    /** 测试用的 IP 地址 */
    const obj = {
      ip: '39.185.100.100',
    }

    const desc = await ctx.service.location.getAddressDescription(obj)
    assert(typeof desc === 'string')
  })
})
