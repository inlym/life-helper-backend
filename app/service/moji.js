'use strict'

/**
 * 封装墨迹天气的 API 请求
 * @see https://market.aliyun.com/products/57096001/cmapi012364.html
 *
 * 限行数据 - limit
 * 空气质量指数 - aqi
 * 短时预报 - shortforecast
 * 生活指数 - index
 * 天气预警 - alert
 * 天气预报24小时 - forecast24hours
 * 天气预报15天 - forecast15days
 * 天气实况 - condition
 * AQI预报5天 - aqiforecast5days
 */

const { Service } = require('egg')
const axios = require('axios')

class MojiService extends Service {
  /**
   * 返回所有的 API 列表
   */
  apis() {
    /** 所有的 api 列表 */
    const apiList = [
      'limit',
      'aqi',
      'shortforecast',
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
   *
   * @param {string} apiName api 的英文名称
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise<object>}
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
        `[Aliyun API Market] 墨迹天气（专业版经纬度）接口请求成功 API => ${apiName} / 经度 => ${longitude} / 纬度 => ${latitude}`
      )
      return response.data.data
    } else {
      logger.error(
        `[Aliyun API Market] 墨迹天气（专业版经纬度）接口请求失败 API => ${apiName} / 经度 => ${longitude} / 纬度 => ${latitude} / 错误原因 => ${response.data.msg}`
      )
    }
  }
}

module.exports = MojiService
