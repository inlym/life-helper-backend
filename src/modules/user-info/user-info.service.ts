import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInfo } from 'src/modules/user-info/user-info.entity'

@Injectable()
export class UserInfoService {
  constructor(@InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>) {}

  /**
   * 获取昵称和头像
   */
  async getBasicInfo(userId: number): Promise<UserInfo> {
    return await this.userInfoRepository.findOne({
      select: ['nickName', 'avatarUrl'],
      where: { id: userId },
    })
  }

  /**
   * 更新基本信息（由微信 `wx.getUserProfile` API 获取）
   */
  async updateInfo(userId: number, userinfo): Promise<UserInfo> {
    return await this.userInfoRepository.save(Object.assign({}, userinfo, { id: userId }))
  }
}
