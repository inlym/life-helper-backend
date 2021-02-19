'use strict'

const { Service } = require('egg')

class WeatherService extends Service {
  /**
   * 获取 icon 图片的路径
   * @param {number|string} id iconId
   * @returns {string}
   */
  getIconUrl(id) {
    /** icon 图片地址前缀（小程序本地） */
    const iconUrlPrefix = '/app/static/image/weather_icon/'

    /**
     * icon 图片地址前缀（存储在阿里云 OSS 上）
     * 'https://img.lh.inlym.com/weather_icon/'
     */

    return `${iconUrlPrefix}${id}.png`
  }

  /**
   * 获取天气实况
   * @param {number} cityId
   * @since 2021-02-07
   */
  async condition(cityId) {
    const { service, app } = this

    /** 原生天气实况数据 */
    const condition = await service.moji.getByCityId('condition', cityId)

    /** 准备从 condition 中获取和转化的属性名 */
    const keys = [
      'condition',
      'temp:temperature',
      'realFeel:sensibleTemperature',
      'pressure:airPressure',
      'humidity',
      'uvi:ultraviolet',
      'vis:visibility',
      'windDir:windDirection',
      'windLevel:windScale',
      'windSpeed',
      'tips:tip',
    ]

    const res = app.only2(condition, keys)

    res.iconUrl = this.getIconUrl(condition.icon)
    res.sunrise = app.dayjs(condition.sunRise).format('H:mm')
    res.sunset = app.dayjs(condition.sunSet).format('H:mm')

    return res
  }

  /**
   * 获取未来 15 天的天气预报
   * @param {number} cityId
   * @since 2021-02-05
   * @update 2021-02-07
   */
  async forecast15Days(cityId) {
    const { service, app } = this

    const forecast = await service.moji.getByCityId('forecast15days', cityId)

    /** 准备提取和转化的属性 - 白天 */
    const dayKeys = [
      'conditionDay:condition',
      'windDirDay:windDirection',
      'windLevelDay:windScale',
      'windSpeedDay:windSpeed',
      'tempDay:temperature',
    ]

    /** 准备提取和转化的属性 - 夜间 */
    const nightKeys = [
      'conditionNight:condition',
      'windDirNight:windDirection',
      'windLevelNight:windScale',
      'windSpeedNight:windSpeed',
      'tempNight:temperature',
    ]

    /** 准备提取和转化的属性 - 公共 */
    const commonKeys = ['predictDate:date', 'uvi:ultraviolet', 'humidity', 'updatetime:updateTime']

    /** 未来 15 天预报列表 */
    const list = []

    /** 每日温度最大值列表（即白天温度） */
    const maxTemperature = []

    /** 每日温度最小值列表（即白天温度） */
    const minTemperature = []

    for (let i = 0; i < forecast.length; i++) {
      const current = forecast[i]
      const obj = app.only2(current, commonKeys)
      obj.day = app.only2(current, dayKeys)
      obj.night = app.only2(current, nightKeys)

      obj.day.iconUrl = this.getIconUrl(current.conditionIdDay)
      obj.night.iconUrl = this.getIconUrl(current.conditionIdNight)

      obj.moonrise = app.dayjs(current.moonrise).format('H:mm')
      obj.moonset = app.dayjs(current.moonset).format('H:mm')
      obj.sunrise = app.dayjs(current.sunrise).format('H:mm')
      obj.sunset = app.dayjs(current.sunset).format('H:mm')

      /** 文案：昨天，今天，明天，后天，周一，周二，…… */
      obj.weekday = service.format.weekdayA(obj.date)

      /** 以 '01/31' 格式输出日期 */
      obj.dateFormatted = app.dayjs(obj.date).format('MM/DD')

      // 将最高温、最低温添加至列表
      maxTemperature.push(parseInt(current.tempDay, 10))
      minTemperature.push(parseInt(current.tempNight, 10))

      list.push(obj)
    }

    return {
      list,
      maxTemperature,
      minTemperature,
    }
  }

  /**
   * 生活指数
   * @param {number} cityId
   * @since 2021-02-07
   */
  async liveIndex(cityId) {
    const { service } = this
    const res = await service.moji.getByCityId('index', cityId)
    const indexList = res[Object.getOwnPropertyNames(res)[0]]
    const result = []

    /** 将原有的名称缩短一下 */
    const codeMap = {
      5: '交通',
      7: '化妆',
      12: '感冒',
      14: '旅游',
      17: '洗车',
      18: '空气污染',
      20: '穿衣',
      21: '紫外线',
      26: '运动',
      28: '钓鱼',
      32: '过敏',
    }

    for (let i = 0; i < indexList.length; i++) {
      const obj = {}
      const item = indexList[i]
      obj.name = codeMap[item.code]
      obj.description = item.desc
      obj.status = item.status
      obj.icon = `https://img.lh.inlym.com/liveindex/${item.code}.svg`
      result.push(obj)
    }

    return result
  }

  /**
   * 空气质量指数
   * @param {number} cityId
   * @since 2021-02-07
   */
  async aqi(cityId) {
    const { service } = this
    const res = await service.moji.getByCityId('aqi', cityId)
    delete res.cityName
    delete res.pubtime
    return res
  }

  /**
   * 空气质量指数预报 5 天
   * @param {number} cityId
   * @since 2021-02-07
   */
  async aqi5Days(cityId) {
    const { service } = this
    const list = await service.moji.getByCityId('aqiforecast5days', cityId)
    for (let i = 0; i < list.length; i++) {
      delete list[i]['publishTime']
    }
    return list
  }

  /**
   * 天气预报 24 小时
   * @param {number} cityId
   * @since 2021-02-08
   */
  async forecast24Hours(cityId) {
    const { app, service } = this
    const list = await service.moji.getByCityId('forecast24hours', cityId)
    const result = []
    let maxTemperature = -999
    let minTemperature = 999
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const obj = app.only2(item, 'condition date hour temp:temperature windlevel:windScale windSpeed pop:rainProb')
      if (parseInt(item.hour, 10) > 6 && parseInt(item.hour, 10) < 18) {
        obj.iconUrl = this.getIconUrl(item.iconDay)
      } else {
        obj.iconUrl = this.getIconUrl(item.iconNight)
      }

      const temperature = parseInt(obj.temperature, 10)
      maxTemperature = maxTemperature > temperature ? maxTemperature : temperature
      minTemperature = minTemperature < temperature ? minTemperature : temperature

      result.push(obj)
    }
    return {
      list: result,
      maxTemperature,
      minTemperature,
    }
  }

  /**
   * 限行数据
   * @param {number} cityId
   * @since 2021-02-08
   *
   * 备注：
   * 1. 该函数返回结果无对应控制器，不可单独获取，仅作为其他数据的一个附加项。
   * 2. 返回结果样例：
   * {
   *   '2021-02-02': [ '2', '8' ],
   *   '2021-02-03': [ '3', '7' ],
   *   ......
   *   '2021-02-17': [ 'W' ]
   * }
   */
  async limit(cityId) {
    const { service } = this
    const list = await service.moji.getByCityId('limit', cityId)
    const obj = {}
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const key = item.date
      const value = item.prompt.split('')
      obj[key] = value
    }
    return obj
  }
}

module.exports = WeatherService
