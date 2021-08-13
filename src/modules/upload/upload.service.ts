import { Injectable } from '@nestjs/common'
import { ClientToken } from 'src/shared/oss/oss.interface'
import { OssService } from 'src/shared/oss/oss.service'
import { GenerateClientTokenConfig } from 'src/shared/oss/oss.interface'

@Injectable()
export class UploadService {
  constructor(private readonly ossService: OssService) {}

  /**
   * 获取一个直传 OSS 的调用凭证
   *
   * @param type 类型
   * @param n 获取的数量
   */
  getOssToken(type: 'video' | 'image'): ClientToken {
    const options: GenerateClientTokenConfig = {}

    if (type === 'video') {
      options.dirname = 'v'
      options.maxSize = 500
    } else if (type === 'image') {
      options.dirname = 'p'
      options.maxSize = 100
    }

    return this.ossService.generateClientToken(options)
  }
}
