import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { LocationService } from './location.service'
import { LbsqqService } from './lbsqq.service'

describe('LocationService', () => {
  let service: LocationService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService, LbsqqService],
      imports: [AppModule],
    }).compile()

    service = module.get<LocationService>(LocationService)
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })
})
