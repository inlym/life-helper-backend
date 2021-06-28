import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { User } from 'src/modules/user/user.entity'

@Injectable()
export class UserService {
  constructor(private readonly connection: Connection) {}

  /**
   * 根据 `openid` 查找用户 ID （若无，则创建新用户）
   * @param openid {string} 小程序平台用户唯一标识
   * @param unionid {string} 开放平台的唯一标识符
   * @returns {Promise<number>} userId
   */
  async findOrCreateUserByOpenid(openid: string, unionid: string): Promise<number> {
    const userRepository = this.connection.getRepository(User)
    const users = await userRepository.find({
      select: ['id'],
      where: {
        openid: openid,
      },
    })

    if (users.length === 1) {
      return users[0].id
    } else if (users.length > 1) {
      throw new Error('findOrCreateUserByOpenid 方法查询出错，查询结果大于 1 条')
    }

    // 查询无结果情况
    const newUser = userRepository.create({
      openid: openid,
      unionid: unionid,
    })
    await userRepository.save(newUser)
    return newUser.id
  }
}
