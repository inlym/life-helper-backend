'use strict'

const { Controller } = require('egg')

class LoginController extends Controller {
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
    const { code } = ctx.query

    const token = await this.service.auth.wxLogin(code)
    this.ctx.body = {
      token,
    }
  }
}

module.exports = LoginController
