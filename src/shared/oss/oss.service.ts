import { HttpStatus, Injectable, Logger, HttpException } from '@nestjs/common'
import * as OSS from 'ali-oss'
import * as crypto from 'crypto'
import { Redis } from 'ioredis'
import { AliyunOssConfig, AliyunOssEndpoint } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { v4 as uuidv4 } from 'uuid'
import { ClientToken, DumpDirname, GenerateClientTokenConfig } from './oss.interface'
import axios from 'axios'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'

@Injectable()
export class OssService {
  private readonly logger = new Logger(OssService.name)
  private readonly ossClient: OSS
  private readonly redis: Redis

  constructor(private redisService: RedisService) {
    this.ossClient = new OSS({
      bucket: AliyunOssConfig.res.bucket,
      accessKeyId: AliyunOssConfig.res.accessKeyId,
      accessKeySecret: AliyunOssConfig.res.accessKeySecret,
      endpoint: AliyunOssEndpoint,
    })

    this.redis = this.redisService.getClient()
  }

  /**
   * 生成一个可用于客户端直传 OSS 的调用凭证
   *
   * @param config 配置项
   *
   * @see [配置内容](https://help.aliyun.com/document_detail/31988.html#title-6w1-wj7-q4e)
   */
  generateClientToken(config: GenerateClientTokenConfig): ClientToken {
    /** 用于存储由客户端直传的文件的 OSS 存储桶 */
    const ossBucket = AliyunOssConfig.res

    /** 目录名称 */
    const dirname = config.dirname

    if (!dirname) {
      throw new Error('dirname 为空')
    }

    /** 有效时间：默认 4 小时 */
    const timeout = (config.expiration || 4) * 60 * 60 * 1000

    /** 上传最大体积，默认 100M */
    const maxSize = (config.maxSize || 100) * 1024 * 1024

    /** 随机文件名（去掉短横线的 uuid） */
    const filename = uuidv4().replace(/-/gu, '')

    /** 文件路径 */
    const key = dirname + '/' + filename

    /** 到期时间：当前时间 + 有效时间 */
    const expiration = new Date(Date.now() + timeout).toISOString()

    const policyText = {
      expiration: expiration,
      conditions: [
        ['eq', '$bucket', ossBucket.bucket],
        ['eq', '$key', key],
        ['content-length-range', 0, maxSize],
      ],
    }

    // 将 policyText 转化为 Base64 格式
    const policy = Buffer.from(JSON.stringify(policyText)).toString('base64')

    // 使用 HmacSha1 算法签名
    const signature = crypto.createHmac('sha1', ossBucket.accessKeySecret).update(policy, 'utf8').digest('base64')

    return {
      key,
      policy,
      signature,
      OSSAccessKeyId: ossBucket.accessKeyId,
      url: ossBucket.url,
    }
  }

  /**
   * 上传文件至 OSS
   *
   * @param name 文件路径，最前面不要加 `/`
   * @param buf 待上传的内容
   * @param options 配置
   *
   * @see [管理文件元信息](https://help.aliyun.com/document_detail/31859.htm)
   */
  async upload(name: string, buf: Buffer, options?: OSS.PutObjectOptions): Promise<string> {
    const result = await this.ossClient.put(name, buf, options)
    if (result.res.status === 200) {
      return result.name
    }

    this.logger.error(`使用 OSS 上传文件失败，name => ${name}, status => ${result.res.status}`)
    throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 转储资源至 OSS
   *
   * @param url 待转储资源的 URL
   * @param dirname 转储目录
   * @param options 配置
   */
  async dump(url: string, dirname: DumpDirname, options: OSS.PutObjectOptions = {}): Promise<string> {
    const response = await axios.request({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
    })

    const field: string = Object.keys(response.headers).find((key: string) => key.toLowerCase() === 'content-type')
    const contentType = response.headers[field]

    options.headers = options.headers || {}
    options.headers['Content-Type'] = contentType

    /** 随机文件名（去掉短横线的 uuid） */
    const filename = uuidv4().replace(/-/gu, '')

    const name = `${dirname}/${filename}`

    const result = await this.ossClient.put(name, response.data, options)
    if (result.res.status === 200) {
      return result.name
    }

    this.logger.error(`转储文件失败, url => ${url}, name => ${name}`)
    throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 获取视频封面图
   *
   * @param url 视频 URL 地址
   *
   * @see [文档地址](https://help.aliyun.com/document_detail/64555.html)
   */
  getVideoSnapshot(url: string) {
    return url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'
  }

  /**
   * 通过检验签名验证回调请求由 OSS 发起
   * @see https://help.aliyun.com/document_detail/31989.html#title-neu-ft5-rlp
   *
   * 说明：
   * 1. 请求头 `x-oss-pub-key-url` - 获取公钥的 URL 地址
   * 2. 请求头 `authorization` - 签名
   *
   * @description
   * 很早之前写的，改了几版，没验证过
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
