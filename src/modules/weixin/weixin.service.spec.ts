import { Test, TestingModule } from '@nestjs/testing'
import { WeixinService } from './weixin.service'

/** 小程序登录获取的 `code` */
const MP_CODE = '031kkKFa1cE94B0E3sJa1irwff1kkKFH'

describe('WeixinService', () => {
  let service: WeixinService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeixinService],
    }).compile()

    service = module.get<WeixinService>(WeixinService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('`code2Session` 方法正常', async () => {
    // ...
  })
})
