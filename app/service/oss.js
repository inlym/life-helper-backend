'use strict'

const { Service } = require('egg')

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
}

module.exports = OssService
