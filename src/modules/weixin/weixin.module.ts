import { Module } from '@nestjs/common'
import { WeixinService } from './weixin.service'

@Module({
  providers: [WeixinService],
  exports: [WeixinService],
})
export class WeixinModule {}
