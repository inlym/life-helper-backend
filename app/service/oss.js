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

    const result = { accessKeyId, policy, signature, basename }
    return result
  }
}

module.exports = OssService
