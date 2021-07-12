import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { ERRORS } from 'src/common/errors.constant'
import { RequestUser } from 'src/common/request-user.interface'
import { User } from 'src/common/user.decorator'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async wxLogin(@User() user: RequestUser) {
    if (user.id <= 0 || user.authType === 'token') {
      throw new HttpException(ERRORS.MP_LOGIN_FAIL, HttpStatus.UNAUTHORIZED)
    }

    const token = await this.authService.createToken(user.id)
    return { token }
  }

  /**
   * 用于 Web 端获取用于扫码的小程序码
   */
  @Get('login/qrcode')
  async getLogonCode() {
    const url = await this.authService.generateLoginWxacode()
    return { url }
  }
}
