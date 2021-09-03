import { Module } from '@nestjs/common'
import { LoginController } from './login.controller'
import { QrcodeModule } from './qrcode/qrcode.module'
import { TokenModule } from './token/token.module'
import { TokenService } from './token/token.service'

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
  providers: [TokenService],
  exports: [TokenService],
})
export class AuthModule {}
