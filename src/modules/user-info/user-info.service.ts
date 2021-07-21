import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateWxUserInfoRequestDto } from './user-info.dto'
import { UserInfo } from './user-info.entity'

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
  async updateInfo(userId: number, userinfo: UpdateWxUserInfoRequestDto) {
    const user = await this.userInfoRepository.findOne(userId)
    this.userInfoRepository.merge(user, userinfo, { id: userId })
    return this.userInfoRepository.save(user)
  }

  /**
   * 单独修改用户的个人头像
   */
  async modifyAvatar(userId: number, url: string) {
    return this.userInfoRepository.update(userId, { avatarUrl: url })
  }
}
