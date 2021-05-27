import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { OssOptions } from '../../config'

@Injectable()
export class OssService {
  /**
   * 生成用于客户端直传 OSS 所需的凭证信息
   * @param dirname {string} 目录名称
   */
  generateClientToken(dirname) {
    const ugcBucket = OssOptions.ugc

    /** 有效时长：30 分钟 */
    const timeout = 30 * 60 * 1000

    /** 上传最大体积 30M */
    const maxSize = 30 * 1024 * 1024

    /** 随机文件名（去掉短横线的 uuid） */
    const filename = uuidv4().replace(/-/gu, '')

    /** 文件路径 */
    const key = dirname + '/' + filename

    /** 到期时间：当前时间 + 有效时长 */
    const expiration = new Date(Date.now() + timeout).toISOString()

    const policyText = {
      expiration: expiration,
      conditions: [
        ['eq', '$bucket', ugcBucket.bucket],
        ['eq', '$key', key],
        ['content-length-range', 0, maxSize],
      ],
    }

    // 将 policyText 转化为 Base64 格式
    const policy = Buffer.from(JSON.stringify(policyText)).toString('base64')

    // 使用 HmacSha1 算法签名
    const signature = crypto.createHmac('sha1', ugcBucket.accessKeySecret).update(policy, 'utf8').digest('base64')

    return {
      url: ugcBucket.url,
      key,
      policy,
      OSSAccessKeyId: ugcBucket.accessKeyId,
      signature,
    }
  }
}
