'use strict'

const { Controller } = require('egg')

class LoginController extends Controller {
  /**
   * @api {get} /login GET /login
   * @apiName wxLogin
   * @apiGroup login
   * @apiVersion 0.9.0
   * @apiDescription 小程序端登录
   *
   * @apiParam (Query) {String} code 小程序下发的 code
   *
   * @apiSuccess (Response) {String} token 登录状态凭证
   *
   * @apiSuccessExample {json} 返回值示例
   *   {
   *     "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   *   }
   */
  async wxLogin() {
    const { ctx, service } = this

    const rule = {
      code: 'string',
      authType: 'string',
    }

    ctx.validate(rule, ctx.authParam)

    if (ctx.authParam.authType === 'code') {
      const token = await service.auth.login(ctx.userId)
      ctx.body = { token }
    }
  }
}

module.exports = LoginController
