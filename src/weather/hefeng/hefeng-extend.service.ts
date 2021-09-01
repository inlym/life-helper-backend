import { Injectable, Logger } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as dayjs from 'dayjs'
import { AliyunOssConfig } from 'life-helper-config'
import { HefengCachedService } from './hefeng-cached.service'
import {
  ExtAirDailyForecastItem,
  ExtAirNow,
  ExtDailyForecastItem,
  ExtHourlyForecastItem,
  ExtLivingIndexItem,
  ExtMinutelyRainItem,
  ExtWarningCity,
  ExtWarningNowItem,
  ExtWeatherNow,
  SkyClass,
} from './hefeng-extend.model'

/**
 * 和风天气 - 数据处理
 *
 * ### 功能说明
 *
 * ```markdown
 * 1. 对获取的数据做二次处理，包含增删字段等处理。
 * ```
 */
@Injectable()
export class HefengExtendService {
  private readonly logger = new Logger(HefengExtendService.name)
  private readonly weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  /** 存储资源的 OSS 绑定的域名 */
  private readonly baseURL = AliyunOssConfig.res.url

  constructor(private readonly hefengCachedService: HefengCachedService) {}

  /**
   * 根据图标 ID 获取图标 URL
   *
   * @param icon 图标 ID
   */
  private getIconUrl(icon: string): string {
    return this.baseURL + '/static/hefeng/c1/' + icon + '.svg'
  }

  /**
   * 根据图标 ID 获取图片 URL（拟物风格图片）
   *
   * @param icon 图标 ID
   */
  private getImageUrl(icon: string): string {
    return this.baseURL + '/static/hefeng/s2/' + icon + '.png'
  }

  /**
   * 获取天气生活指数对应的图标
   */
  private getLivingIndexIconUrl(type: string): string {
    return this.baseURL + '/static/hefeng/live/' + type + '.svg'
  }

  /**
   * 获取实时天气数据
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getWeatherNow(location: string): Promise<ExtWeatherNow> {
    const weatherNow: ExtWeatherNow = await this.hefengCachedService.getWeatherNow(location)
    weatherNow.obsDiff = dayjs().diff(dayjs(weatherNow.obsTime), 'minute')

    return plainToClass(ExtWeatherNow, weatherNow)
  }

  /**
   * 获取逐天天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getDailyForecast(location: string, days: 3 | 7 | 10 | 15): Promise<ExtDailyForecastItem[]> {
    const list = await this.hefengCachedService.getDailyForecast(location, days)

    return list.map((item: ExtDailyForecastItem) => {
      // 添加 `date` 属性，格式：`2021-06-23`
      item.date = item.fxDate

      item.iconDayUrl = this.getIconUrl(item.iconDay)
      item.iconNightUrl = this.getIconUrl(item.iconNight)
      item.imageUrl = this.getImageUrl(item.iconDay)

      const d = dayjs(item.fxDate)

      // 添加 `dayText` 属性，格式：`昨天`，`今天`,`明天`,`后天`,`周一`,`周二` ...
      if (dayjs().get('date') === d.get('date')) {
        item.dayText = '今天'
      } else if (dayjs().add(1, 'day').get('date') === d.get('date')) {
        item.dayText = '明天'
      } else if (dayjs().add(2, 'day').get('date') === d.get('date')) {
        item.dayText = '后天'
      } else if (dayjs().subtract(1, 'day').get('date') === d.get('date')) {
        item.dayText = '昨天'
      } else {
        item.dayText = this.weekText[d.get('day')]
      }

      // 添加 `text` 属性，格式：`多云转晴`，`多云`
      const { textDay, textNight } = item
      if (textDay === textNight) {
        item.text = textDay
      } else {
        item.text = textDay + '转' + textNight
      }

      // 添加 `dateText` 属性，格式：`6/19`
      item.dateText = `${d.get('month') + 1}/${d.get('date')}`

      return plainToClass(ExtDailyForecastItem, item)
    })
  }

  /**
   * 获取逐小时天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getHourlyForecast(location: string, hours: 24 | 72 | 168): Promise<ExtHourlyForecastItem[]> {
    const list = await this.hefengCachedService.getHourlyForecast(location, hours)

    return list.map((item: ExtHourlyForecastItem) => {
      item.iconUrl = this.getIconUrl(item.icon)
      item.time = item.fxTime.substring(11, 16)

      return plainToClass(ExtHourlyForecastItem, item)
    })
  }

  /**
   * 获取天气生活指数
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getLivingIndex(location: string): Promise<ExtLivingIndexItem[]> {
    const list = await this.hefengCachedService.getLivingIndex(location)

    return list.map((item: ExtLivingIndexItem) => {
      item.iconUrl = this.getLivingIndexIconUrl(item.type)

      return plainToClass(ExtLivingIndexItem, item)
    })
  }

  /**
   * 获取实时空气质量
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getAirNow(location: string): Promise<ExtAirNow> {
    const airNow = await this.hefengCachedService.getAirNow(location)

    return plainToClass(ExtAirNow, airNow)
  }

  /**
   * 获取空气质量预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getAirDailyForecast(location: string): Promise<ExtAirDailyForecastItem[]> {
    const list = await this.hefengCachedService.getAirDailyForecast(location)

    return list.map((item: ExtAirDailyForecastItem) => {
      item.date = item.fxDate

      return plainToClass(ExtAirDailyForecastItem, item)
    })
  }

  /**
   * 获取分钟级降水
   *
   * @param location 需要查询地区的以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getMinutelyRain(location: string): Promise<ExtMinutelyRainItem[]> {
    const list = await this.hefengCachedService.getMinutelyRain(location)

    return list.map((item: ExtMinutelyRainItem) => {
      item.time = item.fxTime.substring(11, 16)
      item.height = (parseFloat(item.precip) * 200 + 10).toFixed(0)

      return plainToClass(ExtMinutelyRainItem, item)
    })
  }

  /**
   * 获取天气预警城市列表
   */
  async getWarningCityList(): Promise<ExtWarningCity[]> {
    const list = await this.hefengCachedService.getWarningCityList()

    return list.map((item: ExtWarningCity) => {
      return plainToClass(ExtWarningCity, item)
    })
  }

  /**
   * 获取天气灾害预警
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getWarningNow(location: string): Promise<ExtWarningNowItem[]> {
    const list = await this.hefengCachedService.getWarningNow(location)

    return list.map((item: ExtWarningNowItem) => {
      return plainToClass(ExtWarningNowItem, item)
    })
  }

  /**
   * 根据和风天气的图标数字，输出展示的天空元素
   *
   * @param {string} icon 和风天气的 icon id
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
  skyClass(icon: string): SkyClass {
    const iconId = parseInt(icon, 10)

    /** 最终输出的内容 */
    const result = {
      bgClass: 'wbg-grey',
      sun: true,
      fixedCloud: true,
      movingCloud: true,
      darkCloud: true,
      fullmoon: false,
    }

    if ([100, 103, 150, 153].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.fixedCloud = false
      result.movingCloud = false
      result.darkCloud = false
    } else if ([101, 102].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.movingCloud = false
      result.darkCloud = false
    } else if ([104, 154].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.darkCloud = false
    } else if (iconId >= 300 && iconId < 400) {
      result.bgClass = 'wbg-lightrain'
    }

    /** 当前时间的 小时 */
    const hour = new Date().getHours()

    if (hour <= 6 || hour >= 18) {
      result.sun = false
      result.fullmoon = true
      result.bgClass = 'wbg-night'
    }
    return result
  }
}
