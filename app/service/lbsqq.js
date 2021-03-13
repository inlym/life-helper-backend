'use strict'

const { Service } = require('egg')

/**
 * 当前文件封装对第三方服务 [腾讯位置服务] 的请求方法
 * @tag [HTTP Request] [Reids]
 *
 * @description
 * 1. fetch 开头的方法代表直接向第三方发起请求获取数据
 * 2. get 开头的方法对 fetch 方法附加了一层缓存逻辑以及必要参数处理
 * 3. 缓存内容和函数返回均为整个响应的 body 部分，包含了无效数据，非单纯有效数据部分
 * 4. 缓存逻辑全局几乎一致，但实际上没必要封装，请勿封装缓存逻辑，建议对各个方法单独定义缓存方法
 * 5. 当前文件方法一般会在 location 文件中被调用
 */
class LbsqqService extends Service {
  /** 用于获取 腾讯位置服务 的开发者密钥（从列表随机拿一个） */
  key() {
    const { TENCENT_LBS_KEYS: list } = this.config
    const length = list.length
    return list[Math.floor(Math.random() * length)]
  }

  /**
   * IP 定位
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
        key: this.key(),
      },
    }

    const { data: resData } = await app.axios(requestOptions)
    if (!resData.status) {
      logger.debug(`[HTTP Request] [腾讯位置服务] [IP 定位] 接口请求成功 ip=${ip}`)
      return resData
    } else {
      throw new Error(`[HTTP Request] [腾讯位置服务] [IP 定位] 接口请求失败，错误原因 => ${resData.message}`)
    }
  }

  /** fetchLocationByIp(ip) 函数的缓存版 */
  async getLocationByIp(ip) {
    const { app, service, logger } = this
    const { key, timeout } = service.keys.lbsqqIp2Location(ip)
    const cacheResult = await app.redis.get(key)
    if (cacheResult) {
      logger.debug(`[Redis] lbsqq.getLocationByIp 方法从缓存获取数据，ip=${ip}`)
      return JSON.parse(cacheResult)
    } else {
      const data = await this.fetchLocationByIp(ip)
      app.redis.set(key, JSON.stringify(data), 'EX', timeout)
      return data
    }
  }

  /**
   * 逆地址解析（坐标位置描述）
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
   * @param {string} longitude 经度，格式化 5 位小数后的字符串，例如 '120.11110'
   * @param {string} latitude 纬度，格式化 5 位小数后的字符串，例如 '30.11110'
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
        key: this.key(),
      },
    }

    const { data: resData } = await app.axios(requestOptions)
    if (!resData.status) {
      logger.debug(`[HTTP Request] [腾讯位置服务] [逆地址解析] longitude=${longitude}/ latitude=${latitude}`)
      return resData
    } else {
      throw new Error(`[HTTP Request] 接口请求失败，错误原因 => ${resData.message}`)
    }
  }

  /**
   * fetchAddressByLocation(longitude, latitude) 函数的缓存版
   * @description
   * - 实测经纬度的第 5 位小数变动 加减一，距离变化为 2m
   * - 当前函数将经纬度做了格式化5位处理
   */
  async getAddressByLocation(lng, lat) {
    if (!(lng && lat)) {
      throw new Error('经纬度数据为空')
    }
    const { app, service, logger } = this
    const longitude = parseFloat(lng, 10).toFixed(5)
    const latitude = parseFloat(lat, 10).toFixed(5)
    const { key, timeout } = service.keys.lbsqqLocation2Address(longitude, latitude)
    const cacheResult = await app.redis.get(key)
    if (cacheResult) {
      logger.debug(`[Redis] lbsqq.getAddressByLocation 方法从缓存获取数据，location=${longitude},${latitude}`)
      return JSON.parse(cacheResult)
    } else {
      const data = await this.fetchAddressByLocation(longitude, latitude)
      app.redis.set(key, JSON.stringify(data), 'EX', timeout)
      return data
    }
  }
}

module.exports = LbsqqService
