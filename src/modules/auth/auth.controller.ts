import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/auth.guard'
import { ERRORS } from 'src/common/errors.constant'
import { RequestUser } from 'src/common/request-user.interface'
import { User } from 'src/common/user.decorator'
import { ConfirmLoginRequestDto, LoginByQrCodeQueryDto } from './auth.dto'
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
    const result = await this.authService.generateLoginWxacode()
    return result
  }

  /**
   * 由小程序端发起，对某个小程序码进行认证
   */
  @Post('login/confirm')
  @UseGuards(AuthGuard)
  async confirmLogin(@User('id') userId: number, @Body() body: ConfirmLoginRequestDto) {
    await this.authService.confirmCheckCode(userId, body)
    return {}
  }

  /**
   * 查看登录结果，成功则返回对应登录凭证
   */
  @Get('login/check')
  async loginByQrCode(@Query() query: LoginByQrCodeQueryDto) {
    const { code } = query
    const userId = await this.authService.getUserIdByCheckCode(code)
    if (userId) {
      return await this.authService.createToken(userId)
    }
    return {}
  }
}
