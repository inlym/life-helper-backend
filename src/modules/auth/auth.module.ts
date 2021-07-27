import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { UserInfoModule } from '../user-info/user-info.module'
import { WeixinModule } from '../weixin/weixin.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { QrcodeService } from './qrcode.service'

@Module({
  imports: [WeixinModule, SharedModule, UserInfoModule],
  controllers: [AuthController],
  providers: [AuthService, QrcodeService],
  exports: [AuthService],
})
export class AuthModule {}
