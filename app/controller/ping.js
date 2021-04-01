'use strict'

const { Controller } = require('egg')

/**
 * Ping 控制器用于检测各外部依赖服务是否正常运行
 */

class PingController extends Controller {
  /**
   * @api {get} /ping GET /ping
   * @apiName index
   * @apiGroup ping
   * @apiVersion 0.0.1
   * @apiDescription 用于检测应用是否已启动，如果已启动则响应返回 'ok'，未启动则请求超时无响应
   */
  async index() {
    this.ctx.body = 'ok'
  }

  /**
   * @api {get} /ping/redis GET /ping/redis
   * @apiName redis
   * @apiGroup ping
   * @apiVersion 0.0.1
   * @apiDescription 检测 Redis 服务是否正常运行，如果正常运行则响应返回 'ok'，运行异常则响应返回 'error'
   */
  async redis() {
    const result = await this.app.redis.ping()
    if (result === 'PONG') {
      this.ctx.body = 'ok'
    } else {
      this.ctx.body = 'error'
    }
  }

  /** 检测 MySQL 服务是否正常运行，如果正常运行则响应返回 'ok'，运行异常则响应返回 'error' */
  async mysql() {
    const [results] = await this.app.model.query('SELECT 1+1 as sum;')

    if (results[0]['sum'] === 2) {
      this.ctx.body = 'ok'
    } else {
      this.ctx.body = 'error'
    }
  }

  /** 检测 TableStore 服务是否正常运行，如果正常运行则响应返回 'ok'，运行异常则响应返回 'error' */
  async ots() {
    try {
      const result = await this.app.ots.listTable()

      // 连接成功则返回结果对象存在 tableNames 属性，这是一个列表，连接异常则直接报错
      if (result.tableNames) {
        this.ctx.body = 'ok'
      } else {
        this.ctx.body = 'error'
      }
    } catch (err) {
      this.ctx.body = 'error'
    }
  }
}

module.exports = PingController
