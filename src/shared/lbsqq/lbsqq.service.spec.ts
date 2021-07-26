import { Test, TestingModule } from '@nestjs/testing'
import { Redis } from 'ioredis'
import { LbsqqKeys, RedisConfig } from 'life-helper-config'
import { RedisModule, RedisService } from 'nestjs-redis'
import { LbsqqService } from './lbsqq.service'
import { SharedModule } from '../shared.module'
import { LocateIpResponse } from './lbsqq.interface'

describe('LbsqqService', () => {
  let service: LbsqqService
  let redisService: RedisService
  let redis: Redis

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LbsqqService],
      imports: [SharedModule, RedisModule.register(RedisConfig)],
    }).compile()

    service = module.get<LbsqqService>(LbsqqService)
    redisService = module.get<RedisService>(RedisService)
    redis = redisService.getClient()
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('[method] getKey', () => {
    test('按照递增序列返回 `key`', () => {
      const list = LbsqqKeys
      for (let i = 0; i < list.length; i++) {
        const key = service.getKey()
        expect(key).toBe(list[i])
      }
    })
  })

  describe('[method] locateIp', () => {
    /** 用于测试的 IP 地址 */
    let ip: string

    /** Redis 键名 */
    let redisKey: string

    /** 方法调用结果 */
    let result: LocateIpResponse

    // 准备工作，随机 1 个 IP 地址用于测试（随机 IP 段： `36.96.0.0/9`）
    test('生成 1 个随机 IP 地址', async () => {
      const ip1 = 36
      const ip2 = Math.floor(Math.random() * (223 - 96)) + 96
      const ip3 = Math.floor(Math.random() * 255)
      const ip4 = Math.floor(Math.random() * 255)

      ip = `${ip1}.${ip2}.${ip3}.${ip4}`
      redisKey = `lbsqq:location:ip:${ip}`

      // 如果已有缓存则删除
      const cache = await redis.get(redisKey)
      if (cache) {
        await redis.del(redisKey)
      }

      expect(ip).toBeDefined()
    })

    test('调用方法有响应结果', async () => {
      result = await service.locateIp(ip)
      expect(result).toBeDefined()
    })

    test('响应结果的状态码为 0（表示请求成功）', () => {
      expect(result.status).toBe(0)
    })

    test('请求的 IP 地址与响应数据中的请求 IP 相同', () => {
      expect(ip).toBe(result.result.ip)
    })

    test('响应数据被 Redis 缓存正确', async () => {
      const redisResult = await redis.get(redisKey)
      expect(JSON.parse(redisResult)).toEqual(result)
    })
  })

  afterAll(async () => {
    await redis.quit()
  })
})
