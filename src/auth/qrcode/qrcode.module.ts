import { Module } from '@nestjs/common'
import { QrcodeController } from './qrcode.controller'
import { QrcodeService } from './qrcode.service'

/**
 * 二维码扫码登录模块
 *
 * ### 模块说明
 *
 * ```markdown
 * 1. 处理扫码登录相关逻辑。
 * ```
 */
@Module({
  controllers: [QrcodeController],
  providers: [QrcodeService],
  exports: [QrcodeService],
})
export class QrcodeModule {}
