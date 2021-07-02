import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { AppModule } from '../../app.module'
import { UserEntity } from './user.entity'
import { getRepository, Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

describe('UserService', () => {
  let service: UserService
  let userRepository: Repository<User>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [AppModule],
    }).compile()

    service = module.get<UserService>(UserService)
    userRepository = await getRepository(UserEntity)
  })

  test('成功创建服务', async () => {
    expect(service).toBeDefined()
  })

  describe('findOrCreateUserByOpenid', () => {
    let userId: number

    const fakeOpenid = uuidv4().replace(/-/gu, '')

    const fakeUnionid = uuidv4().replace(/-/gu, '')

    test('使用一个虚拟的 `openid` 创建一个新用户', async () => {
      // 获取当前最大用户 ID
      const lastUser = await userRepository.findOne({
        order: {
          id: 'DESC',
        },
      })

      userId = await service.findOrCreateUserByOpenid(fakeOpenid, fakeUnionid)

      expect(userId).toBe(lastUser.id + 1)
    })

    test('使用该虚拟的 `openid` 查询，返回上述已获取的 `userId` ', async () => {
      const newId = await service.findOrCreateUserByOpenid(fakeOpenid, fakeUnionid)
      expect(newId).toBe(userId)
    })

    test('通过 `userId` 反查用户 `openid` 和 `unionid` 两项内容和生成值一致', async () => {
      const user = await userRepository.findOne(userId)

      expect(user.openid).toBe(fakeOpenid)
      expect(user.unionid).toBe(fakeUnionid)
    })
  })
})
