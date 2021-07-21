import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { ModifyAvatarRequestDto, UpdateWxUserInfoRequestDto } from './user-info.dto'
import { UserInfoService } from './user-info.service'

@Controller('userinfo')
@UseGuards(AuthGuard)
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  /**
   * 获取昵称和头像
   */
  @Get()
  async getBasicInfo(@User('id') userId: number) {
    const result = await this.userInfoService.getBasicInfo(userId)
    if (result) {
      return result
    } else {
      return { nickName: '', avatarUrl: '' }
    }
  }

  /**
   * 更新个人信息
   */
  @Put()
  async updateWxUserInfo(@User('id') userId: number, @Body() body: UpdateWxUserInfoRequestDto) {
    await this.userInfoService.updateInfo(userId, body)
    return body
  }

  /**
   * 修改头像
   */
  @Patch('avatar')
  async modifyAvatar(@User('id') userId: number, @Body() body: ModifyAvatarRequestDto) {
    return this.userInfoService.modifyAvatar(userId, body.avatarUrl)
  }
}
