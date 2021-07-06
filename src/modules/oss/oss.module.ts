import { Module } from '@nestjs/common'
import { OssController } from './oss.controller'
import { OssService } from './oss.service'

@Module({
  controllers: [OssController],
  providers: [OssService],
})
export class OssModule {}
