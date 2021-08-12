import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateWxUserInfoRequestDto } from './user-info.dto'
import { UserInfo } from './user-info.entity'
import { OssService } from 'src/shared/oss/oss.service'
import { AliyunOssConfig } from 'life-helper-config'

@Injectable()
export class UserInfoService {
  private readonly ossPrefix: string = AliyunOssConfig.res.url

  constructor(@InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>, private readonly ossService: OssService) {}

  /**
   * 获取昵称和头像
   */
  async getBasicInfo(userId: number): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      select: ['nickName', 'avatarUrl'],
      where: { id: userId },
    })

    if (!userInfo.avatarUrl.startsWith('http')) {
      userInfo.avatarUrl = this.ossPrefix + '/' + userInfo.avatarUrl
    }

    return userInfo
  }

  /**
   * 更新基本信息（由微信 `wx.getUserProfile` API 获取）
   */
  async updateInfo(userId: number, userinfo: UpdateWxUserInfoRequestDto): Promise<UserInfo> {
    const user = await this.userInfoRepository.findOne(userId)

    // 将头像的图片转储到 OSS 中
    const newUrl = await this.ossService.dump(userinfo.avatarUrl)
    userinfo.avatarUrl = newUrl

    this.userInfoRepository.merge(user, userinfo, { id: userId })
    await this.userInfoRepository.save(user)
    return this.getBasicInfo(userId)
  }
}
