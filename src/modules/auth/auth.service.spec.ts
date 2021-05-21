import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { AppModule } from '../../app.module'

describe('AuthService', () => {
  let service: AuthService

  /** 用户ID */
  let userId: number

  /** 登录凭证 */
  let token: string

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [AppModule],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  test('createToken - 拒绝为小于1的 userId 生成 token', async () => {
    const wrongUserId = 0
    expect(service.createToken(wrongUserId)).rejects.toThrow('userId 不允许小于 1')
  })

  test('createToken - 为一个随机用户 ID（远超普通用户 ID） 生成 token', async () => {
    userId = 100000000 + Math.floor(Math.random() * 1000000)
    token = await service.createToken(userId)

    // 目前 token 长度为 32 位
    expect(token.length).toBe(32)
  })

  test('getUserIdByToken - 使用不存在的 token 应返回 0', async () => {
    const wrongToken = 'helloxxxxxxx'
    const result = await service.getUserIdByToken(wrongToken)
    expect(result).toBe(0)
  })

  test('getUserIdByToken - 使用上述生成的 token 应返回对应的 userId', async () => {
    const result = await service.getUserIdByToken(token)
    expect(result).toBe(userId)
  })
})
