import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TokenService } from './token.service'

describe('TokenService', () => {
  let service: TokenService

  /** 用于测试的用户 ID */
  let testUserId: number

  /** 用于测试的登录凭证 */
  let testToken: string

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TokenService],
    }).compile()

    service = module.get<TokenService>(TokenService)
  })

  describe('(method) createToken', () => {
    it('随机一个不存在的用户 ID，并为其创建登录凭证', async () => {
      // 真实的用户 ID 不会这么大
      testUserId = Math.floor(Math.random() * 10 ** 7 + 10 ** 7)

      testToken = await service.createToken(testUserId, 100)

      expect(testToken).toBeDefined()
    })
  })

  describe('(method) getUserIdByToken', () => {
    it('解析上述过程生成的登录凭证，用户 ID 正确', async () => {
      const result = await service.getUserIdByToken(testToken)

      expect(result).toBe(testUserId)
    })

    it('解析不存在的登录凭证，返回结果为 0', async () => {
      const notExistToken = 'i am inlym'
      const result = await service.getUserIdByToken(notExistToken)

      expect(result).toBe(0)
    })
  })
})
