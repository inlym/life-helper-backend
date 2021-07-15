import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/auth.guard'
import { ERRORS } from 'src/common/errors.constant'
import { RequestUser } from 'src/common/request-user.interface'
import { User } from 'src/common/user.decorator'
import { ConfirmLoginRequestDto, LoginByQrCodeQueryDto, ConfirmLoginQueryDto } from './auth.dto'
import { AuthService } from './auth.service'
import { QrcodeService } from './qrcode.service'
import { AuthenticationStatus } from './qrcode.model'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly qrcodeService: QrcodeService) {}

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
  @Get('auth/qrcode')
  async getLoginQrcode() {
    return this.qrcodeService.getQrcode()
  }

  /**
   * 由小程序端发起，对某个小程序码进行认证
   */
  @Post('login/confirm')
  @UseGuards(AuthGuard)
  async confirmLogin(@User('id') userId: number, @Body() body: ConfirmLoginRequestDto, @Query() query: ConfirmLoginQueryDto) {
    const { code } = body
    const { type } = query
    if (type === 'scan') {
      this.qrcodeService.scanQrcode(userId, code)
    } else if (type === 'confirm') {
      this.qrcodeService.checkQrcode(userId, code)
    }

    return {}
  }

  /**
   * 查看登录结果，成功则返回对应登录凭证
   */
  @Get('login/qrcode')
  async loginByQrcode(@Query() query: LoginByQrCodeQueryDto) {
    const { code } = query

    const { status, userId } = await this.qrcodeService.queryQrcode(code)
    if (AuthenticationStatus.Checked === status) {
      const token = await this.authService.createToken(userId)
      return { status, token }
    }

    return { status }
  }
}
