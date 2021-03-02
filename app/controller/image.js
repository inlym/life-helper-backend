'use strict'

const { Controller } = require('egg')
const path = require('path')

class ImageController extends Controller {
  /**
   * @api {post} /img 上传图片
   * @apiName uploadImage
   * @apiGroup image
   * @apiVersion 0.1.0
   */
  async upload() {
    const { ctx, app } = this
    const oss = app.oss.get('img')
    const stream = await ctx.getFileStream()
    const extname = path.extname(stream.filename)
    const filename = `${app.clearuuid4()}${extname}`
    const doamin = app.config.domain.ossImageUgc

    const result = await oss.put(filename, stream)
    ctx.body = {
      filename,
      url: `https://${doamin}/${result.name}`,
    }
  }
}

module.exports = ImageController
