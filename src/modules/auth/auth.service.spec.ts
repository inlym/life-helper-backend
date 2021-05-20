import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { AppModule } from '../../app.module'

describe('AuthService', () => {
  let service: AuthService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [AppModule],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', async () => {
    console.log('before 1')
    const token = await service.createToken(2333333)
    expect(service).toBeDefined()
    console.log('after 1')
  })

  it('`createToken` 方法运行正常', async () => {
    console.log('before 2')

    const userId = 999999999
    const token = await service.createToken(userId)
    console.log('after 2')
  })
})
