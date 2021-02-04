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
        `[Aliyun API Market] IP归属地查询 -> ip => ${ip} 对应位置信息 => ${JSON.stringify(
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
      logger.debug(`[Redis] IP归属地查询 -> ip => ${ip} 对应位置信息 => ${res}`)
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
      logger.error(`[Aliyun API Market] 请求第三方接口错误，错误原因：${response.data.msg}`)
    }
  }

  /**
   * fetchWeatherCondition(longitude, latitude) 函数的带 Redis 缓存升级版
   * [Redis]
   */
  async getWeatherCondition(longitude, latitude) {
    const { logger, app } = this

    /** 缓存时长：30 分钟 */
    const EXPIRATION = 60 * 30

    /** Redis 键名 */
    const key = `location#weatherCondition:${longitude}/${latitude}`

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
   * @typedef WeatherForecast15Days
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
   * 		forecast: [
   * 		    {
   * 		      conditionDay: '晴',  // 白天天气
   * 		      conditionIdDay: '0',  // 白天天气id
   * 		      conditionIdNight: '30',  // 夜间天气id
   * 		      conditionNight: '晴',  // 夜间天气
   * 		      humidity: '50',  // 湿度
   * 		      moonphase: 'WaxingGibbous',  // 月相
   * 		      moonrise: '2021-01-28 16:59:00',  // 月出
   * 		      moonset: '2021-01-28 06:28:00',  // 月落
   * 		      pop: '20',  // 降水概率
   * 		      predictDate: '2021-01-28',  // 预报日期
   * 		      qpf: '0.0',  // 定量降水预报（mm）
   * 		      sunrise: '2021-01-28 06:52:00',  // 日出
   * 		      sunset: '2021-01-28 17:32:00',  // 日落
   * 		      tempDay: '11',  // 白天温度
   * 		      tempNight: '-1',  // 夜间温度
   * 		      updatetime: '2021-01-28 23:08:00',  // 更新时间
   * 		      uvi: '5',  // 紫外线强度
   * 		      windDegreesDay: '225',  // 白天风向角度
   * 		      windDegreesNight: '0',  // 夜间风向角度
   * 		      windDirDay: '西南风',  // 白天风向
   * 		      windDirNight: '微风',  // 夜间风向
   * 		      windLevelDay: '5-6',  // 白天风级
   * 		      windLevelNight: '1',  // 夜间风级
   * 		      windSpeedDay: '10.8',  // 白天风速
   * 		      windSpeedNight: '0.9'  // 夜间风速
   * 		    },
   *        ...
   * 		]
   * }
   */

  /**
   * 根据经纬度获取未来 15 天的天气预报
   * @see https://market.aliyun.com/products/57096001/cmapi012364.html
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise<WeatherForecast15Days>}
   */
  async fetchWeatherForecast15Days(longitude, latitude) {
    const { app, logger } = this
    const { APPCODE_MOJI } = app.config

    const requestOptions = {
      url: 'http://aliv8.data.moji.com/whapi/json/aliweather/forecast15days',
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${APPCODE_MOJI}`,
      },
      data: `lat=${latitude}&lon=${longitude}&token=7538f7246218bdbf795b329ab09cc524`,
    }

    const response = await app.axios(requestOptions)

    if (!response.data.code) {
      logger.info(
        `[Aliyun API Market] 经度 => ${longitude} / 纬度 => ${latitude} 已获取未来 15 天的天气预报 -> 数据太多，不予打印`
      )
      return response.data.data
    } else {
      logger.error(`[Aliyun API Market] 请求第三方接口错误，错误原因：${response.data.msg}`)
    }
  }

  /**
   * fetchWeatherForecast15Days(longitude, latitude) 函数的带 Redis 缓存升级版
   * [Redis]
   */
  async getWeatherForecast15Days(longitude, latitude) {
    const { logger, app } = this

    /** 缓存时长：30 分钟 */
    const EXPIRATION = 60 * 30

    /** Redis 键名 */
    const key = `location#weatherForecast15Days:${longitude}/${latitude}`

    const res = await app.redis.get(key)

    if (res) {
      logger.debug(
        `[Redis] 经度 => ${longitude} / 纬度 => ${latitude} 对应未来 15 天的天气预报 -> 数据太多，不予打印`
      )
      return JSON.parse(res)
    } else {
      const condition = await this.fetchWeatherForecast15Days(longitude, latitude)
      app.redis.set(key, JSON.stringify(condition), 'EX', EXPIRATION)

      return condition
    }
  }

  /**
   * @typedef WeatherShortForecast
   * @type {object}
   * @example
   * {
   *   "city": {
   *     ...
   *   },
   *   "sfc": {
   *     "banner": "未来一小时不会下雨", // 提示文案
   *     "confirmInfo": {
   *       "comfirmIcon": 255, // 反馈待确认信息
   *       "comfirmIconDesc": "", // 待确认天气名称
   *       "isConfirm": 0 // 底部确认天气文案是否展示（0:否 1:是）
   *     },
   *     "isCorrect": 255, // 当前天气是否被纠正（0:否 1:是）
   *     "isFeedback": 0, // 首页反馈按钮是否展示（0:否 1:是）
   *     "notice": "未来一小时不会下雨", // 完整说明
   *     "percent": [
   *       {
   *         "dbz": 0,
   *         "desc": "无雨", // 降雨级别
   *         "icon": -1, // 天气图标
   *         "percent": 0.0 // 降水强度：0-0.05 无雨，0.05-0.063 毛毛细雨，0.063-0.33 小雨，0.33-0.66 中雨，0.66-1 大雨
   *        },
   *        ...
   *      ],
   *      "rain": 0, 是否降水，“0”代表当前位置没有降水，“1”代表有降水
   *      "rainLastTime": 0,
   *      "sfCondition": 0, // 反演实况
   *      "timestamp": 1612410102000 // 更新时间戳
   *   }
   * }
   */

  /**
   * 根据经纬度获取天气短时预报
   * @see https://market.aliyun.com/products/57096001/cmapi012364.html
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {Promise<WeatherShortForecast>}
   * @since 2021-02-04
   */
  async fetchWeatherShortForecast(longitude, latitude) {
    const { app, logger } = this
    const { APPCODE_MOJI } = app.config

    const requestOptions = {
      url: 'http://aliv8.data.moji.com/whapi/json/aliweather/shortforecast',
      method: 'POST',
      headers: {
        Authorization: `APPCODE ${APPCODE_MOJI}`,
      },
      data: `lat=${latitude}&lon=${longitude}&token=bbc0fdc738a3877f3f72f69b1a4d30fe`,
    }

    const response = await app.axios(requestOptions)

    if (!response.data.code) {
      logger.info(
        `[Aliyun API Market] 经度 => ${longitude} / 纬度 => ${latitude} 已获取短时天气预报 -> 数据太多，不予打印`
      )
      return response.data.data
    } else {
      logger.error(`[Aliyun API Market] 请求第三方接口错误，错误原因：${response.data.msg}`)
    }
  }

  /**
   * fetchWeatherShortForecast(longitude, latitude) 函数的带 Redis 缓存升级版
   * @since 2021-02-04
   * [Redis]
   */
  async getWeatherShortForecast(longitude, latitude) {
    const { logger, app } = this

    /** 缓存时长：30 分钟 */
    const EXPIRATION = 60 * 30

    /** Redis 键名 */
    const key = `location#weatherShortForecast:${longitude}/${latitude}`

    const res = await app.redis.get(key)

    if (res) {
      logger.debug(
        `[Redis] 经度 => ${longitude} / 纬度 => ${latitude} 已获取短时天气预报 -> 数据太多，不予打印`
      )
      return JSON.parse(res)
    } else {
      const result = await this.fetchWeatherShortForecast(longitude, latitude)
      app.redis.set(key, JSON.stringify(result), 'EX', EXPIRATION)
      return result
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
