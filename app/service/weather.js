'use strict'

const { Service } = require('egg')
const dayjs = require('dayjs')

class WeatherService extends Service {
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

  /**
   * 获取天气生活指数
   * @since 2021-03-23
   * @tag [和风天气]
   * @param {string} location 地区的 LocationID 或以英文逗号分隔的经纬度坐标
   * @description
   */
  async index(location) {
    const { service } = this
    const { daily } = await service.hefeng.indices(location)
    const iconUrlPrefix = 'https://img.lh.inlym.com/hefeng/life/'
    const result = daily.map((item) => {
      item.iconUrl = iconUrlPrefix + item.type + '.svg'
      return item
    })
    return result
  }
}

module.exports = WeatherService
