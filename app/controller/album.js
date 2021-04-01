'use strict'

const { Controller } = require('egg')

class AlbumController extends Controller {
  /**
   * @api {post} /album 创建相册
   * @apiName create
   * @apiGroup album
   * @apiVersion 0.9.5
   * @apiDescription 用于创建相册
   *
   * @apiParam (Body) {String} name 相册名称
   *
   * @apiSuccess (Response) {Number} id 创建成功的相册 ID
   * @apiSuccess (Response) {String} name 创建成功的相册名称
   */
  async create() {
    const { ctx, service } = this

    /** body 校验规则 */
    const bodyRule = {
      name: 'string',
    }

    ctx.validate(bodyRule, ctx.request.body)

    const res = await service.album.createAlbum({
      userId: ctx.userId,
      name: ctx.request.body.name,
      ip: ctx.ip,
    })

    ctx.body = {
      id: res.id,
      name: res.name,
    }
  }
}

module.exports = AlbumController
