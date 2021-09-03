import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AliyunOssConfig } from 'life-helper-config'
import { Repository } from 'typeorm'
import { UserInfo } from './user-info.entity'
import { OssService } from 'src/shared/oss/oss.service'
import { UpdateUserInfoRequestDto } from './user-info.dto'

/**
 * 用户信息服务
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 负责用户个人信息的查看和修改。
 * 2. 个人信息指的是：仅用于展示用途，不涉及任何权限、业务逻辑的信息。
 * ```
 */
@Injectable()
export class UserInfoService {
  private readonly logger = new Logger(UserInfoService.name)

  /** 存储头像的 OSS 绑定的 URL */
  private readonly ossURL = AliyunOssConfig.res.url

  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,

    private readonly ossService: OssService
  ) {}

  /**
   * 获取头像的完整 URL
   *
   * @param avatarUrl 存储的头像地址
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 数据库中存储的是 `avatar/xxxxxx` 格式的值。
   * ```
   */
  private getAvatarUrl(avatarUrl: string): string {
    // 为未来可能的情况做一层兼容，如果本身是完整的 URL，则直接返回
    if (avatarUrl.startsWith('http') || !avatarUrl) {
      return avatarUrl
    }

    return this.ossURL + '/' + avatarUrl
  }

  /**
   * 获取用户个人信息实体
   *
   * @param userId 用户 ID
   *
   *
   * ### 为什么需要这个方法？
   *
   * ```markdown
   * 1. 默认情况下，不会创建用户对应的行记录，只有在第一次提交后才会创建。
   * 2. 使用这个方法统一处理行记录不存在的情况，返回对应的实体。
   * ```
   */
  private async getUserInfoEntity(userId: number): Promise<UserInfo> {
    const result = await this.userInfoRepository.findOne(userId)

    if (result) {
      return result
    }

    return this.userInfoRepository.create({ id: userId })
  }

  /**
   * 转储头像
   *
   * @param avatarUrl 原始的头像 URL
   *
   *
   * ### 为什么要转储头像？
   *
   * ```markdown
   * 1. 从微信获取的头像，存在时效性，当用户更换微信头像后，原始的头像 URL 将会失效，无法访问头像。
   * 2. 鉴于[1]，将从微信获取的头像转储到我方服务器上。
   * ```
   *
   *
   * ### 头像 URL 处理说明
   *
   * ```markdown
   * 1. 从微信获取的头像 URL 为：`https://thirdwx.qlogo.cn/../../../132` 格式，最后面的 `132` 代表 `132x132` 尺寸，`0` 代表最大的 `640x640` 尺寸。
   * 2. 在转储时，将最后面的 `132` 改为了 `0`，目前是获取最大尺寸图像。
   * 3. 转储后，存于 OSS 的路径格式为： `avatar/xxxxxx`。
   * ```
   */
  private async dumpAvatar(avatarUrl: string): Promise<string> {
    if (avatarUrl.startsWith('avatar/')) {
      return avatarUrl
    }

    const url = avatarUrl.replace(/132$/, '0')
    const newUrl = await this.ossService.dump(url, 'avatar')

    return newUrl
  }

  /**
   * 根据用户 ID 查找个人信息
   *
   * @param userId 用户 ID
   */
  async getUserInfo(userId: number): Promise<UserInfo> {
    const userInfo = await this.getUserInfoEntity(userId)

    if (userInfo.avatarUrl) {
      userInfo.avatarUrl = this.getAvatarUrl(userInfo.avatarUrl)
    }

    return userInfo
  }

  /**
   * 更新用户个人信息
   *
   * @param userId 用户 ID
   * @param data 客户端提交的数据
   */
  async updateUserInfo(userId: number, data: UpdateUserInfoRequestDto): Promise<UserInfo> {
    const userInfo = await this.getUserInfoEntity(userId)

    if (data.avatarUrl) {
      data.avatarUrl = await this.dumpAvatar(data.avatarUrl)
    }

    this.userInfoRepository.merge(userInfo, data)
    await this.userInfoRepository.save(userInfo)

    return userInfo
  }
}
