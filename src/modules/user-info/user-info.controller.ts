import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserInfoService } from './user-info.service'
import { User } from 'src/common/decorators/user.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'

@Controller('userinfo')
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  @Get('basic')
  @UseGuards(AuthGuard)
  getBasicInfo(@User('id') userId: number) {
    return this.userInfoService.getBasicInfo(userId)
  }
}
