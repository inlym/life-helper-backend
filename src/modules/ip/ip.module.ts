import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { IpController } from './ip.controller'
import { IpService } from './ip.service'

@Module({
  controllers: [IpController],
  imports: [SharedModule],
  providers: [IpService],
})
export class IpModule {}
