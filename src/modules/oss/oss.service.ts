import { Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { RedisService } from 'nestjs-redis'
import { AliyunOssConfig } from 'life-helper-config'
import axios from 'axios'

@Injectable()
export class OssService {
  constructor(private redisService: RedisService) {}
  /**
   * 生成用于客户端直传 OSS 所需的凭证信息
   * @param dirname {string} 目录名称
   * @param limitedSize {number} 上传最大体积，单位：B
   */
  generateClientToken(dirname: string, limitedSize: number) {
    const ugcBucket = AliyunOssConfig.res

    /** 有效时长：4 小时 */
    const timeout = 4 * 60 * 60 * 1000

    /** 上传最大体积，默认 50M */
    const maxSize = limitedSize || 50 * 1024 * 1024

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

  /**
   * 通过检验签名验证回调请求由 OSS 发起
   * @see https://help.aliyun.com/document_detail/31989.html#title-neu-ft5-rlp
   *
   * 说明：
   * 1. 请求头 `x-oss-pub-key-url` - 获取公钥的 URL 地址
   * 2. 请求头 `authorization` - 签名
   *
   */
  async verifyOssCallbackSignature(options) {
    const { signature, ossPubKeyUrlBase64, path, search, rawBody } = options
    const redis = this.redisService.getClient()

    /**
     * 第 1 步：获取公钥
     * 1. 获取后会放 Redis 存着，理论上猜测应该不常变。
     * 2. 意外处理：如果出现异常则将公钥删除重新获取。
     */
    let pubKey = ''
    const redisKey = 'system:oss-public-key'
    const redisResult = await redis.get(redisKey)
    if (redisResult) {
      pubKey = redisResult
    } else {
      const ossPubKeyUrl = Buffer.from(ossPubKeyUrlBase64, 'base64').toString()

      // 校验获取公钥的地址的 host 为 gosspublic.alicdn.com
      const validHost = 'gosspublic.alicdn.com'
      if (new URL(ossPubKeyUrl).host !== validHost) {
        throw new Error(`OSS 回调异常：获取公钥的地址 ${ossPubKeyUrl} 非指定地址，可能为假冒请求！`)
      }

      const { data: resData } = await axios(ossPubKeyUrl)
      if (resData) {
        pubKey = resData
        await redis.set(redisKey, resData, 'EX', 3600 * 24 * 10)
      } else {
        throw new Error('OSS 回调异常：未获取到公钥内容！')
      }
    }

    // 计算签名字符串
    const stringToSign = path + search + '\n' + rawBody

    /** 签名内容 */
    const signatureText = Buffer.from(signature, 'base64')

    // 进行校验
    const verifyResult = crypto.createVerify('RSA-MD5').update(stringToSign).verify(pubKey, signatureText)

    if (verifyResult) {
      return true
    } else {
      throw new Error('OSS 回调异常：签名校验未通过')
    }
  }
}
