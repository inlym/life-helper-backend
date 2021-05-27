import { Module } from '@nestjs/common'
import { OssService } from './oss.service'

@Module({
  providers: [OssService],
})
export class OssModule {}
