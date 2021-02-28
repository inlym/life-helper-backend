'use strict'

const { Service } = require('egg')

/**
 * 将可能在多个控制器中都用到的处理 query 的方法集中放在这里
 */
class QueryhandlerService extends Service {
  /**
   * 处理天气类接口中用于获取 cityId 的通用参数，合并成下一步需要的 options
   * @since 2021-02-07
   * @update 2021-02-20, 2021-02-28
   *
   * 处理逻辑：
   * 1. 对于 province, city, district, longitude, latitude 等 5 个参数不做处理
   * 2. [region=浙江省,杭州市,西湖区] 的格式拆分成 { province, city, district } 对象
   * 3. [location=120.12345,30.12345] （经度,纬度）的格式拆分成 { longitude, latitude } 对象
   * 4. 附加传入 ip
   */
  handleCityIdQueries(ctx) {
    const { province, city, district, longitude, latitude, region, location } = ctx.query

    if (province && city && district) {
      return { province, city, district }
    }

    if (region) {
      const [province1, city1, district1] = region.split(',')
      if (province1 && city1 && district1) {
        return { province: province1, city: city1, district: district1 }
      }
    }

    if (longitude && latitude) {
      return { longitude, latitude }
    }

    if (location) {
      const [longitude1, latitude1] = location.split(',')
      if (longitude1 && latitude1) {
        return { longitude: longitude1, latitude: latitude1 }
      }
    }

    return { ip: ctx.ip }
  }
}

module.exports = QueryhandlerService
