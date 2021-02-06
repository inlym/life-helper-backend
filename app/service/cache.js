'use strict'

const { Service } = require('egg')

class CacheService extends Service {
  /**
   * 设置原生函数的待缓存版本
   * @param {object} options 配置项
   * @param {number} options.expiration 缓存有效期，单位：秒（s）
   * @param {string} options.service 原生函数所在的服务
   * @param {string} options.fn 原生函数的名称
   * @param {string} options.keyPrefix Redis键名前缀
   * @param  {...any} args 原生函数的参数
   */
  async bindCache(options, ...args) {
    const { app, logger, ctx } = this
    const { expiration, service, fn, keyPrefix } = options

    // 组合参数成键名
    let str = ''
    for (let i = 0; i < args.length; i++) {
      if (i !== 0) {
        str += `/${args[i]}`
      } else {
        str += args[i]
      }
    }

    /** Redis 键名 */
    const key = `${keyPrefix}:${str}`

    const res = await app.redis.get(key)

    if (res) {
      logger.debug(
        `[Redis] 从 Redis 获取数据， service => ${service} / fn => ${fn} / key => ${key} / value => ${res}`
      )
      return JSON.parse(res)
    } else {
      const result = await ctx['service'][service][fn](...args)
      app.redis.set(key, JSON.stringify(result), 'EX', expiration)
      return result
    }
  }
}

module.exports = CacheService
