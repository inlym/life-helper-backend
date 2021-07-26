import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/auth.guard'
import { WX_LOGIN_FAIL } from 'src/common/errors.constant'
import { RequestUser } from 'src/common/request-user.interface'
import { User } from 'src/common/user.decorator'
import { ConfirmLoginQueryDto, ConfirmLoginRequestDto, LoginByQrCodeQueryDto, GetOssClientTokenQueryDto } from './auth.dto'
import { AuthService } from './auth.service'
import { AuthenticationStatus } from './qrcode.model'
import { QrcodeService } from './qrcode.service'
import { OssService } from 'src/shared/oss/oss.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly qrcodeService: QrcodeService, private readonly ossService: OssService) {}

  @Get('login')
  async wxLogin(@User() user: RequestUser) {
    if (user.id <= 0 || user.authType === 'token') {
      throw new HttpException(WX_LOGIN_FAIL, HttpStatus.UNAUTHORIZED)
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

  /**
   * 客户端获取能够直传 OSS 的凭证
   */
  @Get('oss_token')
  async getOssClientToken(@Query() query: GetOssClientTokenQueryDto) {
    const { n = 1, type = 'picture' } = query

    const profile = {
      picture: { dirname: 'p', maxSize: 30 * 1024 * 1024 },
      video: { dirname: 'v', maxSize: 500 * 1024 * 1024 },
    }

    const { dirname, maxSize } = profile[type]

    const list = Array(n)
      .fill(0)
      .map(() => this.ossService.generateClientToken({ dirname, maxSize }))

    return { list, maxSize }
  }
}
