import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CommonException } from 'src/common/commom.exception'
import { RequestUser } from 'src/common/common.interface'
import { User } from 'src/common/user.decorator'
import { ScanLoginQueryDto, ScanLoginResponseDto, WxLoginResponseDto } from './login.dto'
import { AuthenticationStatus } from './qrcode/qrcode.model'
import { QrcodeService } from './qrcode/qrcode.service'
import { TokenService } from './token/token.service'

/**
 * 登录控制器
 */
@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private readonly tokenService: TokenService, private readonly qrcodeService: QrcodeService) {}

  /**
   * 微信小程序端登录
   */
  @Get()
  async wxLogin(@User() user: RequestUser): Promise<WxLoginResponseDto> {
    if (user.id > 0 && user.authType === 'code') {
      /** 登录凭证有效时长：10 天 */
      const expiration = 3600 * 24 * 10

      /** 登录凭证 */
      const token = await this.tokenService.createToken(user.id, expiration)

      return { token, expiration }
    }

    throw new CommonException('登录失败！')
  }

  /**
   * 扫码登录
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 这个 API 可能存在高负载，Web 端使用“轮询”（间隔 1 秒）的方式查询扫码结果。
   * ```
   */
  @Get('scan')
  async scanLogin(@Query() query: ScanLoginQueryDto): Promise<ScanLoginResponseDto> {
    const code = query.code

    const authen = await this.qrcodeService.query(code)

    if (authen.status === AuthenticationStatus.Confirmed) {
      /** 登录凭证有效时长：10 天 */
      const expiration = 3600 * 24 * 10

      /** 登录凭证 */
      const token = await this.tokenService.createToken(authen.confirmUserId, expiration)

      const status = authen.status

      await this.qrcodeService.consume(code)

      return { status, token, expiration }
    } else {
      return { status: authen.status }
    }
  }
}
