'use strict'

const { Controller } = require('egg')

class SystemController extends Controller {
  async status() {
    const dataList = await this.service.system.status()
    await this.ctx.render('./status.njk', dataList)
  }
}

module.exports = SystemController
