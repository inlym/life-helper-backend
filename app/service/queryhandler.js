'use strict'

const { Service } = require('egg')

/**
 * 将可能在多个控制器中都用到的处理 query 的方法集中放在这里
 */
class QueryhandlerService extends Service {
  /**
   * 处理天气类接口中用于获取 cityId 的通用参数，合并成下一步需要的 options
   * @since 2021-02-07
   *
   * 优先级：
   * 1. 如果存在 region 参数，则从中获取省市区信息，并传入 options 中
   * 2. 当 1 不存在，如果存在 location 参数，则从中获取经纬度信息，并传入 options 中
   * 3. 当 1 和 2 都不存在，则获取 ctx.ip 赋值 ip 参数，传入 options 中
   *
   * 格式：
   * 1. region - `${province},${city},${district}` - '浙江省,杭州市,西湖区'
   * 2. location - `${longitude},${latitude}` - '120.11111,30.11111'
   */
  handleCityIdQueries(ctx) {
    const { region, location } = ctx.query
    if (region) {
      const [province, city, district] = region.split(',')
      return {
        province,
        city,
        district,
      }
    }

    if (location) {
      const [longitude, latitude] = location.split(',')
      return {
        longitude,
        latitude,
      }
    }

    return {
      ip: ctx.ip,
    }
  }
}

module.exports = QueryhandlerService
