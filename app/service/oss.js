'use strict'

const { Service } = require('egg')
const crypto = require('crypto')

/**
 * 涉及操作 OSS 的方法都放置在当前文件下
 * @since 2021-02-13
 */
class OssService extends Service {
  /**
   * 转储网络图片到 OSS
   * @param {string} url 原图片的 url 地址
   * @param {string} dirname 转储图片的在 OSS 的文件夹
   * @returns {string} path 转储图片在 OSS 的路径
   * @since 2021-02-13
   */
  async dumpImage(url, dirname) {
    const { app } = this
    const oss = app.oss.get('img')

    // 首先获取图片的字节流
    const requestOptions = {
      url,
      responseType: 'arraybuffer',
    }

    /** 图片的字节流 */
    const { data } = await app.axios(requestOptions)

    /** 图片类型，即后缀名，例如：png，jpg 等 */
    const imageType = app.kit.recognizeImageType(data)

    if (!imageType) {
      throw new Error('预备转储的图片不是一个正常的图片格式')
    }

    /** 文件名 */
    const name = app.clearuuid4()

    const result = await oss.put(`${dirname}/${name}.${imageType}`, data)
    return result.name
  }

  /**
   * 生成用于客户端直传 OSS 所需的凭证信息
   * @since 2021-03-24
   * @description
   * 1. 文件名（不包含后缀，例如 .jpg .png）由服务端给出，避免接口被盗用时攻击者自定义文件名污染其他文件。
   * 2. 该 bucket 仅放置由用户上传或生成的图片，格式均为 [32个字符（小写字母+数字）] + [后缀（.jpg .png 等）]
   */
  generateClientToken() {
    const { config, app } = this

    const { bucket, accessKeyId, accessKeySecret } = config.oss.clients.img
    const url = config.domain.ossImageUgc

    const callback = {
      callbackUrl: 'https://api.lh.inlym.com/oss/callback',
      callbackHost: 'api.lh.inlym.com',
      callbackBodyType: 'application/json',
    }

    /** 有效时长：30 分钟 */
    const timeout = 30 * 60 * 1000

    /** 上传最大体积 30M */
    const maxSize = 30 * 1024 * 1024

    /** 文件名不包含后缀部分 */
    const basename = app.clearuuid4()

    const keyPre = `${basename}.`

    const expStr = new Date(Date.now() + timeout).toISOString()

    const policyText = {
      expiration: expStr,
      conditions: [
        ['eq', '$bucket', bucket],
        ['starts-with', '$key', keyPre],
        ['content-length-range', 0, maxSize],
      ],
    }
    const buf = Buffer.from(JSON.stringify(policyText))
    const policy = buf.toString('base64')

    const signature = crypto.createHmac('sha1', accessKeySecret).update(policy, 'utf8').digest('base64')

    const result = { url, accessKeyId, policy, signature, basename, callback: Buffer.from(JSON.stringify(callback)).toString('base64') }
    return result
  }

  /**
   * 处理 OSS 回调
   */
  handleOssCallback(data) {
    this.app.redis.set('temp:oss' + Date.now(), JSON.stringify(data), 'EX', 3600)
  }

  /**
   * 通过检验签名验证回调请求由 OSS 发起
   * @see https://help.aliyun.com/document_detail/31989.html#title-neu-ft5-rlp
   * @tag [Controller]
   * @description
   * 1. 注意该函数直接操作了控制器
   */
  async verifyOssCallbackSignature() {
    const { app, ctx, service } = this

    /**
     * 第 1 步：获取公钥
     * 1. 获取后会放 Redis 存着，理论上猜测应该不常变。
     * 2. 意外处理：如果出现异常则将公钥删除重新获取。
     */
    let pubKey = ''
    const { key: redisKey, timeout } = service.keys.ossPublicKey()

    /** 保存公钥 URL 地址的请求头 */
    const HEADER_OSS_PUB_KEY_URL = 'x-oss-pub-key-url'

    /** 保存签名的请求头 */
    const HEADER_SIGNATURE = 'authorization'

    const redisResult = await app.redis.get(redisKey)
    if (redisResult) {
      pubKey = redisResult
    } else {
      const headerOssPubKeyUrl = ctx.get(HEADER_OSS_PUB_KEY_URL)
      if (!headerOssPubKeyUrl) {
        throw new Error('OSS 回调异常：请求头 x-oss-pub-key-url 为空')
      }
      const ossPubKeyUrl = Buffer.from(headerOssPubKeyUrl, 'base64').toString()

      // 校验获取公钥的地址的 host 为 gosspublic.alicdn.com
      const validHost = 'gosspublic.alicdn.com'
      if (new URL(ossPubKeyUrl).host !== validHost) {
        throw new Error(`OSS 回调异常：获取公钥的地址 ${ossPubKeyUrl} 非指定地址，可能为假冒请求！`)
      }

      const { data: resData } = await app.axios(ossPubKeyUrl)
      if (resData) {
        pubKey = resData
        app.redis.set(redisKey, resData, 'EX', timeout)
      } else {
        throw new Error('OSS 回调异常：未获取到公钥内容！')
      }
    }

    // 计算签名字符串
    const stringToSign = ctx.path + ctx.search + '\n' + JSON.stringify(ctx.request.body)

    this.logger.debug('stringToSign', stringToSign)

    /** 签名内容 */
    const signature = Buffer.from(ctx.get(HEADER_SIGNATURE), 'base64')

    // 进行校验
    const verifyResult = crypto.createVerify('RSA-MD5').update(stringToSign).verify(pubKey, signature)

    this.logger.debug('verifyResult', verifyResult)

    if (verifyResult) {
      return true
    } else {
      // 存储错误回调
      const { key: redisKey2 } = service.keys.ossErrorCallbackRequest(ctx.tracer.traceId)
      app.redis.set(redisKey2, JSON.stringify(ctx.request))
      throw new Error('OSS 回调异常：签名校验未通过')
    }
  }
}

module.exports = OssService
