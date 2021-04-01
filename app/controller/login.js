'use strict'

const { Controller } = require('egg')

/** 用于传递微信小程序 wx.login 获取的 code 的请求头字段 */
const HEADER_CODE_FIELD = 'X-Lh-Code'

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
    const { ctx, logger } = this

    /** query 参数校验规则 */
    const rule = {
      code: {
        required: true,
        type: 'string',
      },
    }

    // 对 query 参数进行校验
    try {
      ctx.validate(rule, ctx.query)
    } catch (err) {
      logger.debug(err)
      ctx.body = {
        errcode: 40001,
        errmsg: 'code为空',
      }
      return
    }

    // 获取参数
    const { code } = ctx.query || ctx.get(HEADER_CODE_FIELD)

    const token = await this.service.auth.wxLogin(code)
    this.ctx.body = {
      token,
    }
  }
}

module.exports = LoginController
