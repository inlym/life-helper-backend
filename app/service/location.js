'use strict'

const { Service } = require('egg')

class LocationService extends Service {
  /**
   * 根据 IP 地址获取位置信息
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
   * @label [HTTP Request]
   * @param {string} ip IP地址
   * @since 2021-02-05
   */
  async fetchLocationByIp(ip) {
    if (!ip) {
      // ip 为空也会请求成功（默认为请求者 ip），这里额外再加一层检验
      throw new Error('ip为空')
    }

    const { app } = this
    const { TENCENT_LBS_KEYS } = app.config

    /** TENCENT_LBS_KEYS 列表的长度 */
    const keysLen = TENCENT_LBS_KEYS.length

    // 从列表中随机抽取一个 key
    const TENCENT_LBS_KEY = TENCENT_LBS_KEYS[Math.floor(Math.random() * keysLen)]

    /** 请求参数 */
    const requestOptions = {
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      params: {
        ip,
        key: TENCENT_LBS_KEY,
      },
    }

    const response = await app.axios(requestOptions)
    if (!response.data.status) {
      return response.data.result
    } else {
      throw new Error(`[HTTP Request] 接口请求失败，错误原因 => ${response.data.message}`)
    }
  }
}

module.exports = LocationService
