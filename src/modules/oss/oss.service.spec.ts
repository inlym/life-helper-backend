import { Test, TestingModule } from '@nestjs/testing'
import { OssService } from './oss.service'

describe('OssService', () => {
  let service: OssService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OssService],
    }).compile()

    service = module.get<OssService>(OssService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
