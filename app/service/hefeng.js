'use strict'

const { Service } = require('egg')

/**
 * 当前文件用于封装 和风天气 相关 API
 * @see https://dev.qweather.com/docs/api/
 * @since 2021-03-10
 *
 * @description
 * - 当前文件的方法仅用于获取原始接口数据，增加缓存逻辑，不对数据本身做处理。
 * - 当前文件的处理逻辑实际上是重复的，可以再次封装，但实际上没多几行代码，为了后期拓展性，不做封装。
 * - 后续在 weather 文件调用方法，同时对数据处理和输出。
 */
class HefengService extends Service {
  /**
   * 获取和风天气内使用的城市的 Location ID
   * @since 2021-03-10
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   * @returns {Promise<string>} locationId
   */
  async getLocationId(longitude, latitude) {
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
      logger.info(`[接口请求成功] 和风天气 - 城市信息查询, location ${requestOptions.params.location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', EXP)
      return resData.location[0].id
    } else {
      logger.error(`[接口请求错误] 和风天气 - 城市信息查询, 请求参数 ${JSON.stringify(requestOptions.params)}, 响应 code ${resData.code}`)
    }
  }

  /**
   * 获取实时空气质量（经纬度）
   * @since 2021-03-10
   * @see https://dev.qweather.com/docs/api/air/air-now/
   */
  async airNow(longitude, latitude) {
    const { app, logger } = this

    const lng = parseFloat(longitude, 10).toFixed(2)
    const lat = parseFloat(latitude, 10).toFixed(2)

    const redisKey = `${app.keys.KEY_HEFENG_AIRNOW_PREFIX}${lng},${lat}`

    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).now
    }

    const { key, baseURL } = app.config.QWEATHER.basic
    const EXP = 60 * 60
    const requestOptions = {
      baseURL,
      url: '/air/now',
      params: {
        location: `${lng},${lat}`,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.info(`[接口请求成功] 和风天气 - 实时空气质量, location ${requestOptions.params.location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', EXP)
      return resData.now
    } else {
      logger.error(`[接口请求错误] 和风天气 - 实时空气质量, 请求参数 ${JSON.stringify(requestOptions.params)}, 响应 code ${resData.code}`)
    }
  }

  /**
   * 获取 15 天逐天天气预报
   * @since 2021-03-11
   * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
   */
  async fore15d(locationId) {
    const { app, logger } = this

    const redisKey = `${app.keys.KEY_HEFENG_15D_PREFIX}${locationId}`

    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).daily
    }

    const { key, baseURL } = app.config.QWEATHER.pro
    const EXP = 60 * 60 * 5
    const requestOptions = {
      baseURL,
      url: '/weather/15d',
      params: {
        location: locationId,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.info(`[接口请求成功] 和风天气 - 逐天天气预报（15天）, location ${requestOptions.params.location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', EXP)
      return resData.daily
    } else {
      logger.error(`[接口请求错误] 和风天气 - 逐天天气预报（15天）, 请求参数 ${JSON.stringify(requestOptions.params)}, 响应 code ${resData.code}`)
    }
  }
}

module.exports = HefengService
