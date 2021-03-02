'use strict'

const { Controller } = require('egg')
const path = require('path')

class ImageController extends Controller {
  /**
   * @api {post} /img 上传图片
   * @apiName uploadImage
   * @apiGroup image
   * @apiVersion 0.1.0
   * @apiDescription 用于客户端上传图片，本接口仅支持上传单张图片
   *
   * @apiParam (Body) {multipart/form-data}
   *
   * @apiSuccess (Response) {String} filename 文件名
   * @apiSuccess (Response) {String} url 文件地址
   *
   * @apiSuccessExample {json} 返回值示例
   * {
   *   "filename":"62c383227c6a4eed87366b58d0d6c5b9.jpg",
   *   "url":"https://img3rd.lh.inlym.com/62c383227c6a4eed87366b58d0d6c5b9.jpg"
   * }
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
