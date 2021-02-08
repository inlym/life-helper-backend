'use strict'

const { Service } = require('egg')

class LocationService extends Service {
  /** 为方便调用，额外增加该函数用于获取 腾讯位置服务 的开发密钥（key） */
  TLKEY() {
    const { TENCENT_LBS_KEYS } = this.app.config

    /** TENCENT_LBS_KEYS 列表的长度 */
    const keysLen = TENCENT_LBS_KEYS.length

    // 从列表中随机抽取一个 key
    const TENCENT_LBS_KEY = TENCENT_LBS_KEYS[Math.floor(Math.random() * keysLen)]

    return TENCENT_LBS_KEY
  }

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

    const { app, logger } = this

    /** 请求参数 */
    const requestOptions = {
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      params: {
        ip,
        key: this.TLKEY(),
      },
    }

    const response = await app.axios(requestOptions)
    if (!response.data.status) {
      logger.debug('[HTTP Request] [腾讯位置服务] [IP 定位] 接口请求成功')
      return response.data.result
    } else {
      throw new Error(`[HTTP Request] 接口请求失败，错误原因 => ${response.data.message}`)
    }
  }

  /**
   * fetchLocationByIp(ip) 函数的缓存版
   * @label [Redis] key => `ip@location:${ip}` / ex => 10days
   * @since 2021-02-06
   */
  async getLocationByIp(...args) {
    return this.ctx.service.cache.bindCache(
      {
        expiration: 60 * 60 * 24 * 10,
        service: 'location',
        fn: 'fetchLocationByIp',
        keyPrefix: 'ip@location',
      },
      ...args
    )
  }

  /**
   * 根据经纬度坐标获取所在位置的文字描述
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
   * @label [HTTP Request]
   * @param {string|number} longitude 经度
   * @param {string|number} latitude 纬度
   * @since 2021-02-06
   */
  async fetchAddressByLocation(longitude, latitude) {
    const { app, logger } = this

    /** 请求参数 */
    const requestOptions = {
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      params: {
        location: `${latitude},${longitude}`,
        get_poi: 0,
        key: this.TLKEY(),
      },
    }

    const response = await app.axios(requestOptions)
    if (!response.data.status) {
      logger.debug('[HTTP Request] [腾讯位置服务] [逆地址解析] 接口请求成功')
      return response.data.result
    } else {
      throw new Error(`[HTTP Request] 接口请求失败，错误原因 => ${response.data.message}`)
    }
  }

  /**
   * fetchAddressByLocation(longitude, latitude) 函数的缓存版
   * @label [Redis] key => `location@address:${longitude}/${latitude}` / ex => 2days
   * @since 2021-02-06
   */
  async getAddressByLocation(...args) {
    return this.ctx.service.cache.bindCache(
      {
        expiration: 60 * 60 * 24 * 2,
        service: 'location',
        fn: 'fetchAddressByLocation',
        keyPrefix: 'location@address',
      },
      ...args
    )
  }

  /**
   * 根据提供的省市区、经纬度等信息或请求者 IP，计算获取对所在位置的一句话粗略描述
   * @see moji.getCityId 封装逻辑和该函数类似
   * @param {object} options
   * @param {?string} options.province 省
   * @param {?string} options.city 市
   * @param {?string} options.district 区县
   * @param {?string} options.longitude 经度
   * @param {?string} options.latitude 纬度
   * @param {?string} options.ip 考虑灵活性，由控制器传入请求者 IP，而不是在这里通过 ctx.ip 直接获取
   * @returns {Promise<string>} AddressDescription
   * @since 2021-02-08
   *
   * 查询优先级：
   * 1. 用户提交的省市区
   * 2. 用户定位获取经纬度，转换的省市区
   * 3. 用户未提供任何信息，请求者 IP 转换的省市区
   */

  async getAddressDescription(options) {
    const { district = '', longitude, latitude, ip } = options

    if (district) {
      return district
    }

    if (longitude && latitude) {
      const res = await this.getAddressByLocation(longitude, latitude)
      const {
        formatted_addresses: { rough = '' },
      } = res
      return rough
    }

    if (ip) {
      const res = await this.getLocationByIp(ip)
      const {
        location: { lng, lat },
      } = res

      const res2 = await this.getAddressByLocation(lng, lat)
      const {
        formatted_addresses: { rough = '' },
      } = res2
      return rough
    }

    return '定位失败'
  }
}

module.exports = LocationService
