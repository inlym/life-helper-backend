import { Module } from '@nestjs/common'
import { QrcodeModule } from './qrcode/qrcode.module'
import { TokenModule } from './token/token.module'
import { LoginController } from './login.controller'

/**
 * 权限模块
 *
 * ### 模块说明
 *
 * ```markdown
 * 1. 处理身份认证相关部分逻辑。
 * ```
 */
@Module({
  imports: [QrcodeModule, TokenModule],
  controllers: [LoginController],
})
export class AuthModule {}
