import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { User } from 'src/common/user.decorator'
import { RequestUser } from 'src/common/request-user.interface'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('login')
  async wxLogin(@User() user: RequestUser) {
    if (user.id <= 0 || user.authType === 'token') {
      throw new HttpException({ errCode: 11223, errMsg: '未提供登录信息' }, HttpStatus.FORBIDDEN)
    }

    const token = await this.authService.createToken(user.id)
    return { token }
  }
}
