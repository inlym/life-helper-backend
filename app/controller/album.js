'use strict'

const { Controller } = require('egg')

class AlbumController extends Controller {
  /**
   * @api {post} /album POST /album
   * @apiName create
   * @apiGroup album
   * @apiVersion 0.9.5
   * @apiDescription 创建相册
   *
   * @apiParam (Body) {String} name 相册名称
   * @apiParamExample {json} 请求数据示例
   * {
   *   name: "Good Album"
   * }
   *
   * @apiSuccess (Response) {Number} id 创建成功的相册 ID
   * @apiSuccess (Response) {String} name 创建成功的相册名称
   * @apiSuccessExample {json} 返回值示例
   * {
   *   id: 1,
   *   name: "Good Album"
   * }
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

  /**
   * @api {get} /album GET /album
   * @apiName list
   * @apiGroup album
   * @apiVersion 0.9.9
   * @apiDescription 获取相册列表
   */
  async list() {
    const { ctx, service } = this
    ctx.body = await service.album.getAlbumList(ctx.userId)
  }
}

module.exports = AlbumController
