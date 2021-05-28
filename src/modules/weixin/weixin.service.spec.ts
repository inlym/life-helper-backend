import { Test, TestingModule } from '@nestjs/testing'
import { WeixinService } from './weixin.service'
import { AppModule } from '../../app.module'

describe('WeixinService', () => {
  let service: WeixinService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeixinService],
      imports: [AppModule],
    }).compile()

    service = module.get<WeixinService>(WeixinService)
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('code2Session', () => {
    test('函数调用成功，返回结果符合格式', async () => {
      const code = '021JLrHa1Boa9B0j5JGa1IrmbW3JLrHX'
      const result = await service.code2Session(code)

      // '返回结果包含 `openid`，且为字符串
      expect(typeof result.openid).toBe('string')

      // '返回结果包含 `unionid`，且为字符串
      expect(typeof result.unionid).toBe('string')

      // '返回结果包含 `session_key`，且为字符串
      expect(typeof result.session_key).toBe('string')
    })
  })
})
