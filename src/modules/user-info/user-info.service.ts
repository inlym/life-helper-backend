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

    // 一般情况下获取到的地址格式为 `d/...`，为兼容可能存储完整 URL 的场景，此处做一个附加的判断
    if (!userInfo.avatarUrl.startsWith('http')) {
      userInfo.avatarUrl = this.ossPrefix + '/' + userInfo.avatarUrl
    }

    return userInfo
  }

  /**
   * 更新基本信息（由微信 `wx.getUserProfile` API 获取）
   */
  async updateInfo(userId: number, userInfo: UpdateWxUserInfoRequestDto): Promise<UserInfo> {
    const user = await this.userInfoRepository.findOne(userId)

    /**
     * 变更从微信获取的 URL 地址
     *
     * @description
     * 从微信获取的头像 URL 为：`https://thirdwx.qlogo.cn/../../../132` 格式，最后面的 `132` 代表 132x132 尺寸，`0` 代表最大的 640x640 尺寸
     */
    const avatarUrl = userInfo.avatarUrl.replace(/132$/, '0')

    // 将头像的图片转储到 OSS 中，并获取内部的地址，格式为 `avatar/...`
    const newUrl = await this.ossService.dump(avatarUrl, 'avatar')
    userInfo.avatarUrl = newUrl

    this.userInfoRepository.merge(user, userInfo, { id: userId })
    await this.userInfoRepository.save(user)
    return this.getBasicInfo(userId)
  }
}
