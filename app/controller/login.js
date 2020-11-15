'use strict'

const { Controller } = require('egg')

class LoginController extends Controller {
  async wxLogin() {
    const { code } = this.ctx.query
    const token = await this.service.auth.wxLogin(code)
    this.ctx.body = {
      token,
    }
  }
}

module.exports = LoginController
