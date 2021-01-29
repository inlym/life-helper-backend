'use strict'

const { Service } = require('egg')

class WeatherService extends Service {
  /**
   * 获取获取 icon 图片的路径
   * @param {number|string} id iconId
   * @returns {string}
   */
  getIconUrl(id) {
    /** icon 图片地址前缀（小程序本地） */
    const iconUrlPrefix = '/image/weather_icon/'

    /**
     * icon 图片地址前缀（存储在阿里云 OSS 上）
     * 'https://img.lh.inlym.com/weather_icon/'
     */

    return `${iconUrlPrefix}${id}.png`
  }

  /**
   * 根据经纬度获取未来 15 天的天气预报
   * 对 api3rd.getWeatherForecast15Days(longitude, latitude) 做一层简单数据处理
   */
  async forecast15Days(longitude, latitude) {
    const { service, app } = this
    const { forecast } = await service.api3rd.getWeatherForecast15Days(longitude, latitude)

    /** 准备提取的属性的键名 */
    const dayKeys = [
      /** 天气情况 */
      'conditionDay:condition',

      /** 风向 */
      'windDirDay:windDirection',

      /** 风力等级 */
      'windLevelDay:windScale',

      /** 风速 */
      'windSpeedDay:windSpeed',

      /** 温度 */
      'tempDay:temperature',
    ]

    const nightKeys = [
      'conditionNight:condition',

      'windDirNight:windDirection',

      'windLevelNight:windScale',

      'windSpeedNight:windSpeed',

      'tempNight:temperature',
    ]

    const commonKeys = [
      /** 日期 */
      'predictDate:date',

      /** 紫外线强度 */
      'uvi:ultraviolet',

      /** 湿度 */
      'humidity',

      /** 更新时间 */
      'updatetime:updateTime',
    ]

    /** 处理结果 */
    const result = []

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

      result.push(obj)
    }

    return result
  }
}

module.exports = WeatherService
