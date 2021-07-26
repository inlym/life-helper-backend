import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { WeixinService } from 'src/shared/weixin/weixin.service'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>, private readonly weixinService: WeixinService) {}

  /**
   * 通过 openid 查找用户，如无，则新建一个
   *
   * @param openid 小程序平台用户唯一标识
   * @param unionid 用户在开放平台的唯一标识符
   */
  async findOrCreateUser(openid: string, unionid: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { openid } })
    if (user) {
      return user.id
    }

    const newUser = await this.userRepository.save({ openid, unionid })
    return newUser.id
  }

  /**
   * 通过 code 获取用户 ID
   *
   * @param code 微信小程序端获取的临时登录凭证
   */
  async getUserIdByCode(code: string): Promise<number> {
    const { openid, unionid } = await this.weixinService.code2Session(code)
    const userId = await this.findOrCreateUser(openid, unionid)
    return userId
  }
}
