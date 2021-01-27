'use strict'

const { Service } = require('egg')

class Api3rdService extends Service {
  /**
   * @typedef LocationInfo
   * @type {Object}
   * @property {string} en_short 英文简称
   * @property {string} en_name 国家英文名称
   * @property {string} nation 国家
   * @property {string} province 省份
   * @property {string} city 城市
   * @property {string} district 县区
   * @property {string} adcode 邮政编码
   * @property {number} lat 纬度
   * @property {number} lng 经度
   *
   * @example
   * {
   *   en_short: 'CN',
   *   en_name: 'China',
   *   nation: '中国',
   *   province: '浙江省',
   *   city: '杭州市',
   *   district: '西湖区',
   *   adcode: 330106,
   *   lat: 30.12345,
   *   lng: 120.12345,
   * }
   */

  /**
   * 通过 IP 换取定位信息
   * @see https://market.aliyun.com/products/57002002/cmapi00035184.html
   * @param {!string} ip
   * @returns {Promise<LocationInfo>}
   */
  async fetchLocation(ip) {
    const { app, logger } = this
    const { APPCODE_IPLOCATION } = app.config
    const { axios } = app

    const requestOptions = {
      url: 'https://ips.market.alicloudapi.com/iplocaltion',
      method: 'GET',
      params: {
        ip: ip,
      },
      headers: {
        Authorization: `APPCODE ${APPCODE_IPLOCATION}`,
      },
    }

    const response = await axios(requestOptions)

    const SUCCESS_STATUS = 200
    const SUCCESS_CODE = 100

    if (response.status !== SUCCESS_STATUS) {
      throw new Error('第三方错误：HTTP状态码非200')
    } else if (response.data.code !== SUCCESS_CODE) {
      throw new Error(`第三方错误：错误原因：${response.data.message}`)
    } else {
      logger.info(
        `[Aliyun API Market] IP归属地查询，ip => ${ip} 对应位置信息 => ${JSON.stringify(
          response.data.result
        )}}`
      )
      return response.data.result
    }
  }

  /**
   * fetchLocation(ip) 函数的带 Redis 缓存升级版
   * [Redis] `ip#location:${ip}` => `JSON.stringify(location)`
   */
  async getLocation(ip) {
    const { logger, app } = this

    /** Redis 键名 */
    const key = `ip#location:${ip}`

    /** 缓存时长：10天 */
    const EXPIRATION = 3600 * 24 * 10

    const res = await app.redis.get(key)

    if (res) {
      logger.debug(`[Redis] IP归属地查询，ip => ${ip} 对应位置信息 => ${res}`)
      return JSON.parse(res)
    } else {
      const location = await this.fetchLocation(ip)

      app.redis.set(key, JSON.stringify(location), 'EX', EXPIRATION)
      return location
    }
  }

  /**
   * @typedef WeatherCondition
   * @type {object}
   *
   * @example
   * {
   * 		"city": {
   * 			"cityId": 284873,
   * 			"counname": "中国",
   * 			"ianatimezone": "Asia/Shanghai",
   * 			"name": "杭州市西湖区",
   * 			"pname": "浙江省",
   * 			"secondaryname": "杭州市",
   * 			"timezone": "8"
   * 		},
   * 		"condition": {
   * 			"condition": "多云",  // 实时天气
   * 			"conditionId": "8",  // 实时天气id
   * 			"humidity": "77",  // 湿度
   * 			"icon": "31",  // 天气icon
   * 			"pressure": "1024",  // 气压
   * 			"realFeel": "3",  // 体感温度
   * 			"sunRise": "2021-01-26 06:53:00",  // 日出时间
   * 			"sunSet": "2021-01-26 17:31:00",  // 日落时间
   * 			"temp": "8",  // 温度
   * 			"tips": "明天有雨，天气阴冷，穿暖和点吧！",  // 一句话提示
   * 			"updatetime": "2021-01-26 19:15:08",  // 发布时间
   * 			"uvi": "1",  // 紫外线强度
   * 			"vis": "5464",  // 能见度
   * 			"windDegrees": "0",  // 风向角度
   * 			"windDir": "北风",  // 风向
   * 			"windLevel": "4",  // 风级
   * 			"windSpeed": "6.4"  // 风速
   * 		}
   * }
   */

  /**
   * 根据经纬度获取天气实况
   * @see https://market.aliyun.com/products/57096001/cmapi012364.html
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise<WeatherCondition>}
   */
  async fetchWeatherCondition(longitude, latitude) {
    const { app, logger } = this
    const { APPCODE_MOJI } = app.config

    const requestOptions = {
      url: 'http://aliv8.data.moji.com/whapi/json/aliweather/condition',
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${APPCODE_MOJI}`,
      },
      data: `lat=${latitude}&lon=${longitude}&token=ff826c205f8f4a59701e64e9e64e01c4`,
    }

    const response = await app.axios(requestOptions)

    if (!response.data.code) {
      logger.info(
        `[Aliyun API Market] 经度 => ${longitude} / 纬度 => ${latitude} 对应天气实况 -> ${JSON.stringify(
          response.data.data
        )}`
      )
      return response.data.data
    } else {
      logger.error(`请求第三方接口错误，错误原因：${response.data.msg}`)
    }
  }

  /**
   * fetchWeatherCondition(longitude, latitude) 函数的带 Redis 缓存升级版
   * [Redis]
   */
  async getWeatherCondition(longitude, latitude) {
    const { logger, app } = this

    /** 缓存时长：1小时 */
    const EXPIRATION = 3600

    /** Redis 键名 */
    const key = `location#weather_condition:${longitude}/${latitude}`

    const res = await app.redis.get(key)

    if (res) {
      logger.debug(`[Redis] 经度 => ${longitude} / 纬度 => ${latitude} 对应天气实况 -> ${res}`)
      return JSON.parse(res)
    } else {
      const condition = await this.fetchWeatherCondition(longitude, latitude)
      app.redis.set(key, JSON.stringify(condition), 'EX', EXPIRATION)

      return condition
    }
  }

  /**
   * 查询快递物流信息
   * @see https://market.aliyun.com/products/57126001/cmapi021863.html
   * @param {!string} expressNumber 快递单号
   * @returns {Promise<ExpressInfo>}
   */
  async fetchExpressInfo(expressNumber) {
    if (!expressNumber || typeof expressNumber !== 'string') {
      throw new Error('参数错误: 快递单号(expressNumber)为空或非字符串')
    }

    const { app } = this
    const { APPCODE_EXPRESS } = app.config
    const { axios } = app

    const requestOptions = {
      url: 'http://wuliu.market.alicloudapi.com/kdi',
      method: 'GET',
      params: {
        no: expressNumber,
      },
      headers: {
        Authorization: `APPCODE ${APPCODE_EXPRESS}`,
      },
    }

    const response = await axios(requestOptions)

    this.logger.info(`快递信息查询 - 返回数据为 ${JSON.stringify(response.data)}`)

    return response.data
  }
}

module.exports = Api3rdService
