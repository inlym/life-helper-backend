import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetOssTokenQueryDto } from './upload.dto'
import { UploadService } from './upload.service'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 获取一个直传 OSS 的调用凭证
   */
  @Get('token')
  getOssToken(@Query() query: GetOssTokenQueryDto) {
    return this.uploadService.getOssToken(query.type)
  }
}
