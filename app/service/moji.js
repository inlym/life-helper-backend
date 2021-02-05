'use strict'

const { Service } = require('egg')
const axios = require('axios')

class MojiService extends Service {
  /**
   * 返回所有的 API 列表：
   * 1. 限行数据 - limit
   * 2. 空气质量指数 - aqi
   * 3. 短时预报（经纬度版独有） - shortforecast
   * 4. 生活指数 - index
   * 5. 天气预警 - alert
   * 6. 天气预报24小时 - forecast24hours
   * 7. 天气预报15天 - forecast15days
   * 8. 天气实况 - condition
   * 9. AQI预报5天 - aqiforecast5days
   */
  apis() {
    /** 所有的共有的 api 列表 */
    const apiList = [
      'limit',
      'aqi',
      'index',
      'alert',
      'forecast24hours',
      'forecast15days',
      'condition',
      'aqiforecast5days',
    ]
    return apiList
  }

  /**
   * 通过 fetch 获取的数据结构：
   * { city:{ cityId: 284873, ...}, fieldName:{ ... }}
   * 每个 api 的 fieldName 都不一样，返回该映射关系
   */
  fields() {
    const obj = {
      limit: 'limit',
      aqi: 'aqi',
      shortforecast: 'sfc',
      index: 'liveIndex',
      alert: 'alert',
      forecast24hours: 'hourly',
      forecast15days: 'forecast',
      condition: 'condition',
      aqiforecast5days: 'aqiForecast',
    }
    return obj
  }

  /**
   * 封装墨迹天气的 API 请求（经纬度版）
   * @see https://market.aliyun.com/products/57096001/cmapi012364.html
   * @param {string} apiName api 的英文名称
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise<object>}
   * @since 2021-02-04
   *
   */
  async fetchByLocation(apiName, longitude, latitude) {
    const { app, logger } = this
    const { APPCODE_MOJI } = app.config

    /** 每个 API 都有不同的 token */
    const token = {
      limit: 'c712899b393c7b262dd7984f6eb52657',
      aqi: '6e9a127c311094245fc1b2aa6d0a54fd',
      shortforecast: 'bbc0fdc738a3877f3f72f69b1a4d30fe',
      index: '42b0c7e2e8d00d6e80d92797fe5360fd',
      alert: 'd01246ac6284b5a591f875173e9e2a18',
      forecast24hours: '1b89050d9f64191d494c806f78e8ea36',
      forecast15days: '7538f7246218bdbf795b329ab09cc524',
      condition: 'ff826c205f8f4a59701e64e9e64e01c4',
      aqiforecast5days: '17dbf48dff33b6228f3199dce7b9a6d6',
    }

    const requestOptions = {
      url: `http://aliv8.data.moji.com/whapi/json/aliweather/${apiName}`,
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${APPCODE_MOJI}`,
      },
      data: `lat=${latitude}&lon=${longitude}&token=${token[apiName]}`,
    }

    const response = await axios(requestOptions)

    if (!response.data.code) {
      logger.info(
        `[Aliyun API Market] 墨迹天气（经纬度版）接口请求成功 API => ${apiName} / 经度 => ${longitude} / 纬度 => ${latitude}`
      )
      return response.data.data
    } else {
      logger.error(
        `[Aliyun API Market] 墨迹天气（经纬度版）接口请求失败 API => ${apiName} / 经度 => ${longitude} / 纬度 => ${latitude} / 错误原因 => ${response.data.msg}`
      )
    }
  }

  /**
   * 封装墨迹天气的 API 请求（城市ID版）
   * @see https://market.aliyun.com/products/57096001/cmapi013828.html
   * @param {string} apiName api 的英文名称
   * @param {number} cityId 城市ID
   * @returns {Promise<object>}
   * @since 2021-02-04
   */
  async fetchByCityId(apiName, cityId) {
    const { app, logger } = this
    const { APPCODE_MOJI2 } = app.config

    /** 每个 API 都有不同的 token */
    const token = {
      limit: '27200005b3475f8b0e26428f9bfb13e9',
      aqi: '8b36edf8e3444047812be3a59d27bab9',
      index: '5944a84ec4a071359cc4f6928b797f91',
      alert: '7ebe966ee2e04bbd8cdbc0b84f7f3bc7',
      forecast24hours: '008d2ad9197090c5dddc76f583616606',
      forecast15days: 'f9f212e1996e79e0e602b08ea297ffb0',
      condition: '50b53ff8dd7d9fa320d3d3ca32cf8ed1',
      aqiforecast5days: '0418c1f4e5e66405d33556418189d2d0',
    }

    const requestOptions = {
      url: `http://aliv18.data.moji.com/whapi/json/alicityweather/${apiName}`,
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${APPCODE_MOJI2}`,
      },
      data: `cityId=${cityId}&token=${token[apiName]}`,
    }

    const response = await axios(requestOptions)

    if (!response.data.code) {
      logger.info(
        `[Aliyun API Market] 墨迹天气（城市ID版）接口请求成功 API => ${apiName} / cityId => ${cityId}`
      )
      return response.data.data
    } else {
      logger.error(
        `[Aliyun API Market] 墨迹天气（城市ID版）接口请求失败 API => ${apiName} / cityId => ${cityId} / 错误原因 => ${response.data.msg}`
      )
    }
  }

  /**
   * 封装 fetchByLocation 函数，返回其内部有效数据（带缓存处理）
   * @param {string} apiName api 的英文名称
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @since 2021-02-04
   */
  async getByLocation(apiName, longitude, latitude) {
    const { logger, app, ctx } = this

    /** 天气数据缓存时长：30 分钟 */
    const EXPIRATION_WEATHER = 60 * 30

    /** 经纬度和城市ID对应关系缓存时长：10 天 */
    const EXPIRATION_LOCATION = 60 * 24 * 10

    // 对经纬度格式化处理：统一转换成带 3 位小数的字符串
    longitude = Number(longitude).toFixed(3)
    latitude = Number(latitude).toFixed(3)

    /** Redis 键名（经纬度） */
    const keyLocation = `moji#${apiName}#location:${longitude}/${latitude}`

    const res = await app.redis.get(keyLocation)

    if (res) {
      logger.debug(
        `[Redis] 墨迹天气（经纬度）从Redis获取数据 API => ${apiName} / 经度 => ${longitude} / 纬度 => ${latitude}`
      )
      return JSON.parse(res)
    } else {
      const result = await this.fetchByLocation(apiName, longitude, latitude)

      /** 有效数据的字段名 */
      const field = this.fields()[apiName]

      /** 城市ID */
      const { cityId } = result.city

      /** Redis 键名（城市） */
      const keyCity = `moji#${apiName}#city:${cityId}`

      /** Redis 键名 */
      const keyLocation2City = `location@cityId:${longitude}/${latitude}`

      // [Redis] 经纬度 -> 有效数据
      app.redis.set(keyLocation, JSON.stringify(result[field]), 'EX', EXPIRATION_WEATHER)

      // [Redis] 额外存入一份 城市ID -> 有效数据
      app.redis.set(keyCity, JSON.stringify(result[field]), 'EX', EXPIRATION_WEATHER)

      // [Redis] 额外存入一份 经纬度 -> 城市ID
      app.redis.set(keyLocation2City, cityId, 'EX', EXPIRATION_LOCATION)

      // [Redis] 额外存入一份 指定用户的城市ID信息
      if (ctx.userId) {
        /** Redis 键名 */
        const keyUser = `user:${ctx.userId}`
        app.redis.hset(keyUser, 'cityId', cityId)
      }

      return result[field]
    }
  }

  /**
   * 封装 fetchByCityId 函数，返回其内部有效数据（带缓存处理）
   * @param {string} apiName api 的英文名称
   * @param {number} cityId 城市ID
   * @returns {Promise<object>}
   * @since 2021-02-05
   */
  async getByCityId(apiName, cityId) {
    const { logger, app } = this

    /** Redis 键名（城市） */
    const keyCity = `moji#${apiName}#city:${cityId}`

    const res = await app.redis.get(keyCity)

    if (res) {
      logger.debug(
        `[Redis] 墨迹天气（城市ID）从Redis获取数据 API => ${apiName} / cityId => ${cityId}`
      )
      return JSON.parse(res)
    } else {
      const result = await this.fetchByCityId(apiName, cityId)

      /** 有效数据的字段名 */
      const field = this.fields()[apiName]

      /** 天气数据缓存时长：30 分钟 */
      const EXPIRATION_WEATHER = 60 * 30

      // [Redis] 城市ID -> 有效数据
      app.redis.set(keyCity, JSON.stringify(result[field]), 'EX', EXPIRATION_WEATHER)

      return result[field]
    }
  }
}

module.exports = MojiService
