import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from 'nestjs-redis'
import { HefengService } from './hefeng.service'
import { AppModule } from '../../app.module'

describe('HefengService', () => {
  let service: HefengService
  let redisService: RedisService
  let redis

  // 用于测试校验数据
  const longitude = 120.12345
  const latitude = 30.12345
  const locationId = '101210113'

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HefengService],
      imports: [AppModule],
    }).compile()

    service = module.get<HefengService>(HefengService)
    redisService = module.get<RedisService>(RedisService)
    redis = redisService.getClient()
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('getLocationId', () => {
    let result: string

    test('函数正常调用', async () => {
      result = await service.getLocationId(longitude, latitude)
      expect(result).toBeDefined()
    })

    test('返回结果与预期值相同', () => {
      expect(result).toBe(locationId)
    })
  })
})
