'use strict'

const { Controller } = require('egg')
const sp = require('spawn-object')

class DebugController extends Controller {
  /**
   * @api {all} /debug ALL /debug
   * @apiName index
   * @apiGroup debug
   * @apiVersion 0.9.5
   * @apiDescription 原样返回请求信息，用于调试请求
   */
  async index() {
    const { ctx, service } = this
    ctx.body = service.debug.getRequestDetail()
  }

  /**
   * @api {get} /request/:id GET /request/:id
   * @apiName request
   * @apiGroup debug
   * @apiVersion 0.9.5
   * @apiDescription 查看请求日志
   */
  async request() {
    const { app, ctx } = this
    const { ots } = app
    const { id } = ctx.params
    if (!id) {
      ctx.body = {}
      return
    }
    const params = {
      tableName: 'request_log',
      primaryKey: sp({ request_id: id }),
    }
    const res = await ots.getRow(params)
    const list = res.row.attributes
    const response = {}
    for (let i = 0; i < list.length; i++) {
      response[list[i]['columnName']] = list[i]['columnValue']
    }
    ctx.body = response
  }

  /**
   * @api {all} /debug/temp ALL /debug/temp
   * @apiName temp
   * @apiGroup debug
   * @apiVersion 0.9.5
   * @apiDescription 用于临时测试
   */
  async temp() {
    const { ctx, service } = this
    const query = {
      name: 'are',
      age: 33,
    }
    const res = await service.mp.getUnlimitedQRCode({ query })
    ctx.body = res
  }
}

module.exports = DebugController
