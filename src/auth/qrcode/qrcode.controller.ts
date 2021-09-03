import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { ConfirmQueryDto, ConfirmResponseDto, ScanQueryDto, ScanResponseDto } from './qrcode.dto'
import { QrcodeProfile } from './qrcode.model'
import { QrcodeService } from './qrcode.service'

@ApiTags('qrcode')
@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  /**
   * 获取二维码信息
   */
  @Get()
  async getQrcode(): Promise<QrcodeProfile> {
    return this.qrcodeService.getQrcode()
  }

  /**
   * 扫码操作
   */
  @Put('scan')
  @UseGuards(AuthGuard)
  async scan(@User('id') userId: number, @Query() query: ScanQueryDto): Promise<ScanResponseDto> {
    const code = query.code

    const authen = await this.qrcodeService.scan(userId, code)
    return { scanTime: authen.scanTime } as ScanResponseDto
  }

  /**
   * 确认登录操作
   */
  @Put('confirm')
  @UseGuards(AuthGuard)
  async confirm(@User('id') userId: number, @Query() query: ConfirmQueryDto): Promise<ConfirmResponseDto> {
    const code = query.code

    const authen = await this.qrcodeService.confirm(userId, code)
    return { confirmTime: authen.confirmTime } as ConfirmResponseDto
  }
}
