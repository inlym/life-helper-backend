import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { UserInfoService } from './user-info.service'
import { User } from 'src/common/user.decorator'
import { AuthGuard } from 'src/common/auth.guard'
import { updateReqDto } from './user-info.dto'

@Controller('userinfo')
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  /**
   * 获取昵称和头像
   */
  @Get()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async update(@User('id') userId: number, @Body() body: updateReqDto) {
    await this.userInfoService.updateInfo(userId, body)
    return body
  }
}
