'use strict'

const { Service } = require('egg')
const dayjs = require('dayjs')

class WeatherService extends Service {
  /**
   * 获取 icon 图片的路径
   * @param {number|string} id iconId
   * @returns {string}
   */
  getIconUrl(id) {
    /** icon 图片地址前缀（小程序本地） */
    const iconUrlPrefix = '/images/weather_icon/'

    /**
     * icon 图片地址前缀（存储在阿里云 OSS 上）
     * 'https://img.lh.inlym.com/weather_icon/'
     */

    return `${iconUrlPrefix}${id}.png`
  }

  /**
   * 对天气情况做的简单归类，用于客户端展示对应天气样式
   * @since 2021-03-05
   * @param {number} conditionId 墨迹天气 API 接口的提供的 conditionId
   * @returns {string} 天气值：0-未知、1-晴、2-云、3-阴、4-雨、5-雪、6-雾、7-尘
   */
  getWeatherType(conditionId) {
    const { includeNum } = this.service.utils
    const id = parseInt(conditionId, 10)
    if (includeNum(['1-7'], id)) {
      return 1
    }
    if (includeNum(['8-12', '80-82'], id)) {
      return 2
    }
    if (includeNum([13, 14, 36, 85], id)) {
      return 3
    }
    if (includeNum(['15-23', '37-57', '66-70', 78, '86-93'], id)) {
      return 4
    }
    if (includeNum(['24-25', '58-63', '71-77', 94], id)) {
      return 5
    }
    if (includeNum(['26-28', '64-65', '83-84'], id)) {
      return 6
    }
    if (includeNum(['29-35', 79], id)) {
      return 7
    }
    return 0
  }

  /**
   * 根据 conditionId 计算客户端首页的 天空 面板需要展示哪些元素
   * @since 2021-03-09
   * @param {number} conditionId 墨迹天气 API 接口的提供的 conditionId
   *
   * 背景类：
   * - 普通 wbg-common
   * - 夜晚 wbg-night
   * - 小中雨 wbg-lightrain
   * - 灰暗 wbg-grey
   *
   * 天空元素类：
   * - 满月 fullmoon
   * - 半月 halfmoon
   * - 太阳 sun
   * - 固定云 fixed-cloud
   * - 浮动云 moving-cloud
   * - 乌云 darkcloud
   * - 雨点 rain
   *
   * 1-晴、2-云、3-阴、4-雨、5-雪、6-雾、7-尘
   */
  skyElement(conditionId) {
    /** 当前时间的 小时 */
    const hour = new Date().getHours()

    /** 最终输出的内容 */
    let result = {}

    const weatherType = this.getWeatherType(conditionId)

    if (weatherType === 1) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
      }
    } else if (weatherType === 2) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
        fixedCloud: true,
      }
    } else if (weatherType === 3) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
      }
    } else if (weatherType === 4) {
      result = {
        bgClass: 'wbg-lightrain',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
        darkCloud: true,
        rain: true,
      }
    } else {
      result = {
        bgClass: 'wbg-grey',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
        darkCloud: true,
      }
    }

    if (hour <= 6 || hour >= 18) {
      delete result.sun
      result.fullmoon = true
      result.bgClass = 'wbg-night'
    }

    return result
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
      'icon',
    ]

    const res = app.only2(condition, keys)

    // 下面这行后面去掉
    res.iconUrl = this.getIconUrl(condition.icon)

    res.sunrise = app.dayjs(condition.sunRise).format('H:mm')
    res.sunset = app.dayjs(condition.sunSet).format('H:mm')

    res.skyElement = this.skyElement(condition.conditionId)

    return res
  }

  /**
   * 获取未来 15 天的天气预报
   * @param {number} cityId
   * @deprecated
   * @since 2021-02-05
   * @update 2021-02-07
   */
  async forecast15Days(cityId) {
    const { service, app } = this

    const forecast = await service.moji.getByCityId('forecast15days', cityId)

    /** 准备提取和转化的属性 - 白天 */
    const dayKeys = ['conditionDay:condition', 'windDirDay:windDirection', 'windLevelDay:windScale', 'windSpeedDay:windSpeed', 'tempDay:temperature']

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

      // 以下两行过两天就去掉，图片地址由客户端维护
      obj.day.iconUrl = this.getIconUrl(current.conditionIdDay)
      obj.night.iconUrl = this.getIconUrl(current.conditionIdNight)

      obj.day.icon = current.conditionIdDay
      obj.night.icon = current.conditionIdNight

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
   * @tag 墨迹天气
   * @param {number} cityId
   * @since 2021-02-08
   * @update 2021-03-10
   */
  async forecast24Hours(cityId) {
    const { app, service } = this
    const list = await service.moji.getByCityId('forecast24hours', cityId)
    const nowHour = new Date().getHours()
    const result = []
    let maxTemperature = -999
    let minTemperature = 999
    for (let i = 0; i < list.length; i++) {
      const item = list[i]

      // 可能缓存临界点时，第 1 条为过期数据
      if (i === 0 && parseInt(item.hour, 10) < nowHour) {
        continue
      }

      const obj = app.only2(item, 'condition:text date temp windlevel:windScale windSpeed humidity windSpeed pop')

      // 天气图标根据时间决定白天还是夜晚图标
      if (parseInt(item.hour, 10) > 6 && parseInt(item.hour, 10) < 18) {
        obj.icon = item.iconDay
      } else {
        obj.icon = item.iconNight
      }

      // 小时的时间文案
      if (parseInt(item.hour, 10) === nowHour && i < 3) {
        obj.hour = '现在'
      } else {
        obj.hour = `${item.hour}时`
      }

      const temperature = parseInt(obj.temp, 10)
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
   * 返回结果样例：
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

  /**
   * 将空气质量指数的数字转换为对应的文本
   * @description 以下对应的文本及颜色均来自于国家标准文件要求，请勿轻易改动。
   * @param {number} aqi 空气质量指数
   * @since 2021-03-04(0.1.0)
   */
  aqiDesc(aqi) {
    const descList = [
      {
        level: '一级',
        class: '优',
        color: '#00E400',
      },

      {
        level: '二级',
        class: '良',
        color: '#E1E100',
      },

      {
        level: '三级',
        class: '轻度污染',
        color: '#E17E00',
      },

      {
        level: '四级',
        class: '中度污染',
        color: '#E10000',
      },

      {
        level: '五级',
        class: '重度污染',
        color: '#99004C',
      },

      {
        level: '六级',
        class: '严重污染',
        color: '#7E0023',
      },
    ]

    let index = 0
    const value = parseInt(aqi, 10) || 0
    if (value <= 50) {
      index = 0
    } else if (value <= 100) {
      index = 1
    } else if (value <= 150) {
      index = 2
    } else if (value <= 200) {
      index = 3
    } else if (value <= 300) {
      index = 4
    } else {
      index = 5
    }

    return descList[index]
  }

  /**
   * 获取未来 2 天（即今天和明天）天气情况
   * @tag 墨迹天气
   * @since 2021-03-04
   * @update 2021-03-12
   * @param {number} cityId 城市 ID
   * @returns {Promise<Array>}
   */
  async forecast2Days(cityId) {
    const { service } = this

    const promises = []

    promises.push(service.moji.getByCityId('forecast15days', cityId))
    promises.push(service.moji.getByCityId('aqiforecast5days', cityId))

    const [forecast15days, aqiforecast5days] = await Promise.all(promises)

    const list = []
    for (let i = 1; i < 3; i++) {
      const { conditionDay, conditionNight, tempDay, tempNight, conditionIdDay, predictDate } = forecast15days[i]
      const { value } = aqiforecast5days[i]
      const icon = conditionIdDay
      const item = {
        max: tempDay,
        min: tempNight,
        icon,
        date: predictDate,
      }
      if (conditionDay === conditionNight) {
        item.desc = conditionDay
      } else {
        item.desc = `${conditionDay}转${conditionNight}`
      }

      const aqiDesc = this.aqiDesc(value)

      item.aqiClass = aqiDesc.class
      item.aqiColor = aqiDesc.color

      if (i === 1) {
        item.daytext = '今天'
      } else if (i === 2) {
        item.daytext = '明天'
      }

      list.push(item)
    }

    return list
  }

  /**
   * 获取逐天天气预报（7天，15天）
   * @param {string} days 天数，枚举值：'7d', '15d'
   * @tag 和风天气
   * @since 2021-03-18
   */
  async dailyForecast(location, days) {
    const { service } = this
    const weekdayList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    const promises = []

    if (days === '7d') {
      promises.push(service.hefeng.fore7d(location))
    } else if (days === '15d') {
      promises.push(service.hefeng.fore15d(location))
    }
    promises.push(service.hefeng.air5d(location))
    const [foreNd, aqi5d] = await Promise.all(promises)

    const aqi5dObj = service.utils.convertArray2Object(aqi5d.daily, 'fxDate')

    const { daily } = foreNd
    for (let i = 0; i < daily.length; i++) {
      const item = daily[i]
      const now = new Date()
      const itemDate = new Date(item.fxDate)

      if (now.getDate() === itemDate.getDate()) {
        item.weekday = '今天'
        if (i > 0) {
          daily[i - 1]['weekday'] = '昨天'
        }
      } else if (i > 0 && daily[i - 1]['weekday'] === '今天') {
        item.weekday = '明天'
      } else if (i > 1 && daily[i - 2]['weekday'] === '今天') {
        item.weekday = '后天'
      } else {
        item.weekday = weekdayList[itemDate.getDay()]
      }

      item.date = item.fxDate
      delete item.fxDate

      /** 日期的缩略格式，例如：3/9, 3/10 */
      item.dateText = `${itemDate.getMonth() + 1}/${itemDate.getDate()}`

      /** 天气变化的文本描述，例如：阴转小雨 */
      if (item.textDay === item.textNight) {
        item.desc = item.textDay
      } else {
        item.desc = `${item.textDay}转${item.textNight}`
      }

      /** 线性图标地址前缀 */
      const iconUrl = 'https://img.lh.inlym.com/hefeng/c1/'

      /** 拟物图标地址前缀 */
      const imageUrl = 'https://img.lh.inlym.com/hefeng/s2/'

      item.imageUrl = `${imageUrl}${item.iconDay}.png`
      item.iconDayUrl = `${iconUrl}${item.iconDay}.svg`
      item.iconNightUrl = `${iconUrl}${item.iconNight}.svg`

      // 添加 aqi
      if (aqi5dObj[item.date]) {
        item.aqi = aqi5dObj[item.date]
      }
    }

    return daily
  }

  /**
   * 获取逐小时天气预报（24 小时）
   * @param {string} hours 小时数，枚举值：'24h'
   * @tag 和风天气
   * @since 2021-03-19
   * @description
   * 1. 当前仅 '24h'，预留以后 '72h'， '168h' 情况
   */
  async hourlyForecast(location, hours) {
    const { service } = this
    let resData = {}
    const iconUrlPrefix = 'https://img.lh.inlym.com/hefeng/c1/'
    const imageUrlPrefix = 'https://img.lh.inlym.com/hefeng/s2/'

    if (hours === '24h') {
      resData = await service.hefeng.fore24h(location)
    } else {
      throw new Error('参数错误，目前仅 24h')
    }
    const { hourly } = resData
    const now = dayjs()
    const result = hourly.map((item) => {
      const t = dayjs(item.fxTime)
      if (t.isSame(now, 'hour')) {
        item.hourText = '现在'
      } else {
        item.hourText = t.hour() + '时'
      }

      if (t.isBefore(now, 'day')) {
        item.weekday = '昨天'
      } else if (t.isSame(now, 'day')) {
        item.weekday = '今天'
      } else if (t.isAfter(now, 'day')) {
        item.weekday = '明天'
      }

      item.iconUrl = iconUrlPrefix + item.icon + '.svg'
      item.imageUrl = imageUrlPrefix + item.icon + '.png'

      return item
    })

    return result
  }

  /**
   * 获取分钟级降水（未来 2 小时，间隔 5 分钟）
   * @since 2021-03-16
   * @tag [和风天气]
   * @param {string} longitude
   * @param {string} latitude
   */
  async minutelyRain(location) {
    const { service } = this
    const { updateTime, summary, minutely } = await service.hefeng.minutelyRain(location)
    const updateTimeObj = new Date(updateTime)
    const formattedUpdateTime = updateTimeObj.getHours() + ':' + service.utils.zerofill(updateTimeObj.getMinutes())
    const list = []
    for (let i = 0; i < minutely.length; i++) {
      const item = minutely[i]
      const time = new Date(item.fxTime)
      const obj = {
        precip: item.precip,
        time: time.getHours() + ':' + service.utils.zerofill(time.getMinutes()),
        height: parseFloat(item.precip) * 200 + 10,
      }
      list.push(obj)
    }
    return { summary, list, updateTime: formattedUpdateTime }
  }

  /**
   * 获取实时天气
   * @since 2021-03-17
   * @tag [和风天气]
   * @param {string} location 地区的 LocationID 或以英文逗号分隔的经纬度坐标
   * @description
   * 1. 当前方法主要用于对 hefeng.weatherNow 方法的数据处理，用于控制器调用
   * 2. 为了输出总结语句(summary)，额外调用了 hefeng.fore7d 方法
   */
  async weatherNow(location) {
    const { service } = this
    const promises = []
    promises.push(service.hefeng.weatherNow(location))
    promises.push(service.hefeng.fore7d(location))
    const [weathernow, fore7d] = await Promise.all(promises)
    const { now } = weathernow

    const today = service.utils.getDate()
    let todayItem = null
    for (let i = 0; i < fore7d.daily.length; i++) {
      if (today === fore7d.daily[i]['fxDate']) {
        todayItem = fore7d.daily[i]
        break
      }
    }
    const summary = `现在${now.text}，温度 ${now.temp} 度，今天最高温度 ${todayItem.tempMax} 度，最低温度 ${todayItem.tempMin} 度。当前湿度 ${now.humidity}%，${now.windDir}${now.windScale}级，风速 ${now.windSpeed}km/h`

    const skyElement = this.skyClass(now.icon)
    const result = { skyElement, summary }
    Object.assign(result, now)
    return result
  }

  /**
   * 根据和风天气的图标数字，输出展示的天空元素
   * @since 2021-03-17
   * @tag [和风天气]
   * @param {string} icon 和风天气的icon id
   *
   * @description
   * 背景类：
   * - 普通 wbg-common
   * - 夜晚 wbg-night
   * - 小中雨 wbg-lightrain
   * - 灰暗 wbg-grey
   *
   * 天空元素类：
   * - 满月 fullmoon
   * - 半月 halfmoon
   * - 太阳 sun
   * - 固定云 fixed-cloud
   * - 浮动云 moving-cloud
   * - 乌云 darkcloud
   * - 雨点 rain
   *
   * 1-晴、2-云、3-阴、4-雨、5-雪、6-雾、7-尘
   */
  skyClass(icon) {
    const { includeNum } = this.service.utils
    icon = parseInt(icon, 10)

    /** 最终输出的内容 */
    let result = {}

    if (includeNum([100, 103, 150, 153], icon)) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
      }
    } else if (includeNum([101, 102], icon)) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
        fixedCloud: true,
      }
    } else if (includeNum([104, 154], icon)) {
      result = {
        bgClass: 'wbg-common',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
      }
    } else if (includeNum(['300-399'], icon)) {
      result = {
        bgClass: 'wbg-lightrain',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
        darkCloud: true,
        rain: true,
      }
    } else {
      result = {
        bgClass: 'wbg-grey',
        sun: true,
        fixedCloud: true,
        movingCloud: true,
        darkCloud: true,
      }
    }

    /** 当前时间的 小时 */
    const hour = new Date().getHours()

    if (hour <= 6 || hour >= 18) {
      delete result.sun
      result.fullmoon = true
      result.bgClass = 'wbg-night'
    }
    return result
  }
}

module.exports = WeatherService
