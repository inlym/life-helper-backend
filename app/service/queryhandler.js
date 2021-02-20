'use strict'

const { Service } = require('egg')

/**
 * 将可能在多个控制器中都用到的处理 query 的方法集中放在这里
 */
class QueryhandlerService extends Service {
  /**
   * 处理天气类接口中用于获取 cityId 的通用参数，合并成下一步需要的 options
   * @since 2021-02-07
   * @update 2021-02-20
   */
  handleCityIdQueries(ctx) {
    const { query } = ctx
    query.ip = ctx.ip
    return query
  }
}

module.exports = QueryhandlerService
