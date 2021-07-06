import { Controller, Get, Query } from '@nestjs/common'
import { GetClientTokenQueryDto } from './oss.dto'
import { OssService } from './oss.service'

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 客户端获取能够直传 OSS 的凭证
   *
   * 说明：
   * 1. 不区分业务模块，客户端所有需要将图片（`picture`）直传 OSS 的场景，均调取该接口获取凭证
   * 2. 资源上传至 `oss://p/*`
   */
  @Get('token')
  getClientToken(@Query() query: GetClientTokenQueryDto) {
    const { n = 1, type = 'picture' } = query

    const profile = {
      picture: { dirname: 'p', maxSize: 30 * 1024 * 1024 },
      video: { dirname: 'v', maxSize: 500 * 1024 * 1024 },
    }

    const { dirname, maxSize } = profile[type]

    const list = Array(n)
      .fill(0)
      .map(() => this.ossService.generateClientToken(dirname, maxSize))

    return { list, maxSize }
  }
}
