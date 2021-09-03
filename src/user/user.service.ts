import { Injectable, Logger } from '@nestjs/common'
import { WeixinService } from 'src/shared/weixin/weixin.service'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly weixinService: WeixinService
  ) {}

  /**
   * 通过 openid 和 unionid 查找用户（若不存在则新建一个）
   *
   * @param openid 小程序平台用户唯一标识
   * @param unionid 用户在开放平台的唯一标识符
   */
  async findOrCreateUser(openid: string, unionid: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { openid } })

    if (user) {
      return user
    }

    const newUser = this.userRepository.create()
    newUser.openid = openid
    newUser.unionid = unionid

    await this.userRepository.save(newUser)
    this.logger.log(`新增用户，id => ${newUser.id}，openid => ${openid}，unionid => ${unionid}`)

    return newUser
  }

  /**
   * 根据微信小程序端获取的 `code`，查找对应的用户 ID
   *
   * @param code 微信小程序端获取的临时登录凭证
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 包含了创建新用户的过程。
   * ```
   */
  async getUserIdByCode(code: string): Promise<number> {
    const { openid, unionid } = await this.weixinService.code2Session(code)
    const user = await this.findOrCreateUser(openid, unionid)
    return user.id
  }
}
