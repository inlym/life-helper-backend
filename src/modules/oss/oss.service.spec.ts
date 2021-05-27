import { Test, TestingModule } from '@nestjs/testing'
import { OssService } from './oss.service'
import { OssOptions } from '../../config'

describe('OssService', () => {
  let service: OssService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OssService],
    }).compile()

    service = module.get<OssService>(OssService)
  })

  test('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('generateClientToken', () => {
    test('普通调用，逐个检查返回参数，格式正确', () => {
      const ugcBucket = OssOptions.ugc
      const dirname = 'test'
      const result = service.generateClientToken(dirname)

      expect(result.url).toBe(ugcBucket.url)
      expect(result.OSSAccessKeyId).toBe(ugcBucket.accessKeyId)
      expect(result.key && typeof result.key === 'string' && result.key.startsWith(dirname + '/')).toBeTruthy()
      expect(result.policy && typeof result.policy === 'string').toBeTruthy()
      expect(result.signature && typeof result.signature === 'string').toBeTruthy()
    })
  })
})
