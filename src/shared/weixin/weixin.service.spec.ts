import { Test, TestingModule } from '@nestjs/testing'
import { Redis } from 'ioredis'
import { RedisConfig } from 'life-helper-config'
import { RedisModule, RedisService } from 'nestjs-redis'
import { SharedModule } from '../shared.module'
import { WeixinService } from './weixin.service'

describe('WeixinService', () => {
  let service: WeixinService
  let redisService: RedisService
  let redis: Redis

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeixinService],
      imports: [SharedModule, RedisModule.register(RedisConfig)],
    }).compile()

    service = module.get<WeixinService>(WeixinService)
    redisService = module.get<RedisService>(RedisService)
    redis = redisService.getClient()
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('[method] code2Session', () => {
    test('这个方式需要手动传入真实的 code，没办法自动化测试', () => {
      expect(service).toBeDefined()
    })
  })

  describe('[method] getAccessToken', () => {
    const redisKey = 'weixin:token'

    let token: string
    let token2: string

    test('预备环境，清除缓存中的 token', async () => {
      await redis.del(redisKey)
      const result = await redis.get(redisKey)
      expect(result).toBeNull()
    })

    test('第一次调用，调用成功', async () => {
      token = await service.getAccessToken()
      expect(token).toBeDefined()
    })

    test('直接从 Redis 中检查，返回 token 与存储 token 一致', async () => {
      const result = await redis.get(redisKey)
      expect(result).toBe(token)
    })

    test('第二次调用（本次应该从缓存中读取），返回结果一致', async () => {
      const result = await service.getAccessToken()
      expect(result).toBe(token)
    })

    test('第三次调用，加上强制更新参数，返回的 token 应改变', async () => {
      const result = await service.getAccessToken(true)
      expect(result).not.toBe(token)
      token2 = result
    })

    test('再次检查，第三次强制更新调用获得的 token 确实存入 Redis', async () => {
      const result = await redis.get(redisKey)
      expect(result).toBe(token2)
    })
  })

  afterAll(async () => {
    await redis.quit()
  })
})
