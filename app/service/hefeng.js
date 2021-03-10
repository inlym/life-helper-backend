'use strict'

const { Service } = require('egg')

/**
 * 当前文件用于封装 和风天气 相关 API
 * @see https://dev.qweather.com/docs/api/
 * @since 2021-03-10
 */
class HefengService extends Service {
  /**
   * 获取和风天气内使用的城市的 Location ID
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   * @returns {Promise<string>}
   */
  async getCityId(longitude, latitude) {
    const { app, logger } = this

    const lng = parseFloat(longitude, 10).toFixed(3)
    const lat = parseFloat(latitude, 10).toFixed(3)

    const redisKey = `${app.keys.KEY_HEFENG_LOCATION_PREFIX}${lng},${lat}`

    // 先检查是否有缓存，若有则直接从缓存中获取并返回
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).location[0].id
    }

    // 无缓存则请求接口获取数据，并将接口数据缓存（有效期 10 天）
    const { key } = app.config.QWEATHER.basic
    const EXP = 60 * 60 * 24 * 10
    const requestOptions = {
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      params: {
        location: `${lng},${lat}`,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', EXP)
      return resData.location[0].id
    } else {
      logger.error(`[接口请求错误] 和风天气 - 城市信息查询, 请求参数 ${JSON.stringify(requestOptions.params)}, 响应 code ${resData.code}`)
    }
  }
}

module.exports = HefengService
