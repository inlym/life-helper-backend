import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from 'nestjs-redis'
import { HefengService } from './hefeng.service'
import { AppModule } from '../../app.module'

describe('HefengService', () => {
  let service: HefengService
  let redisService: RedisService
  let redis

  // 用于测试校验数据
  const longitude = 120.17276
  const latitude = 30.276271
  const locationId = '101210110'

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

  describe('getData', () => {
    test('函数正常调用', async () => {
      const options = {
        type: 'weather-now',
        locationId,
      }
      const result = await service.getData(options)
      expect(result).toBeDefined()
    })
  })
})
