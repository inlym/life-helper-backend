import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from 'nestjs-redis'
import { LbsqqService } from './lbsqq.service'
import { AppModule } from '../../app.module'
import { lbsqq } from 'src/config'
import { IpLocationResult, GeoLocationCoderResult } from './location.interface'

describe('LbsqqService', () => {
  let service: LbsqqService
  let redisService: RedisService
  let redis

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LbsqqService],
      imports: [AppModule],
    }).compile()

    service = module.get<LbsqqService>(LbsqqService)
    redisService = module.get<RedisService>(RedisService)
    redis = redisService.getClient()
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('getKey', () => {
    test('按照递增序列返回 `key`', () => {
      const originalKeys = lbsqq.keys
      const length: number = originalKeys.length
      for (let i = 0; i < length; i++) {
        expect(service.getKey()).toBe(originalKeys[i])
      }
    })
  })

  describe('ipLocation', () => {
    // 首先随机生成 1 个用于测试 IP 地址（随机 IP 段： `36.96.0.0/9`）
    const ip1 = 36
    const ip2 = Math.floor(Math.random() * (223 - 96)) + 96
    const ip3 = Math.floor(Math.random() * 255)
    const ip4 = Math.floor(Math.random() * 255)

    const ip = `${ip1}.${ip2}.${ip3}.${ip4}`
    let result: IpLocationResult

    test('函数调用成功', async () => {
      result = await service.ipLocation(ip)
      expect(result).toBeDefined()
    })

    test('查询 IP 正确（结果中包含请求 IP）', () => {
      expect(result.ip).toBe(ip)
    })

    test('返回结果格式正确', () => {
      expect(result.location).toBeDefined()
      expect(result.ad_info).toBeDefined()
    })

    test('返回结果已存入 Redis', async () => {
      const redisKey = `lbsqq:location:ip:${ip}`
      const redisResult = await redis.get(redisKey)
      expect(JSON.stringify(result)).toBe(redisResult)
    })
  })

  describe('geoLocationCoder', () => {
    // 随机生成 1 个国内的经纬度
    const longitude = Math.floor(Math.random() * 10000) / 10000 + 120
    const latitude = Math.floor(Math.random() * 10000) / 10000 + 30

    let result: GeoLocationCoderResult

    test('函数调用成功', async () => {
      result = await service.geoLocationCoder(longitude, latitude)
      expect(result).toBeDefined()
    })

    test('返回结果格式正确', () => {
      expect(result.address).toBeDefined()
      expect(result.formatted_addresses).toBeDefined()
    })

    test('返回结果已存入 Redis', async () => {
      const redisKey = `lbsqq:address:location:${longitude},${latitude}`
      const redisResult = await redis.get(redisKey)
      expect(JSON.stringify(result)).toBe(redisResult)
    })
  })
})
