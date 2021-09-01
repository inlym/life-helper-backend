import { Injectable, Logger } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as dayjs from 'dayjs'
import { AliyunOssConfig } from 'life-helper-config'
import { WarningNowItem } from './hefeng/hefeng-http.model'
import { HefengPublicService } from './hefeng/hefeng-public.service'
import {
  CombinedWeather,
  ExtAirDailyForecastItem,
  ExtAirNow,
  ExtDailyForecastItem,
  ExtHourlyForecastItem,
  ExtLivingIndexItem,
  ExtMinutelyRainItem,
  ExtWeatherNow,
} from './weather.model'

/**
 * ### 功能说明
 *
 * ```markdown
 * 1. 对从 `HefengPublicService` 获取的数据做数据处理，形成可被直接调用的天气数据。
 * ```
 */
@Injectable()
export class WeatherDataService {
  private readonly logger = new Logger(WeatherDataService.name)
  private readonly weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  constructor(private readonly hefengPublicService: HefengPublicService) {}

  /**
   * 根据图标 ID 获取图标 URL
   *
   * @param icon 图标 ID
   */
  private getIconUrl(icon: string): string {
    return AliyunOssConfig.admin.url + '/static/hefeng/c1/' + icon + '.svg'
  }

  /**
   * 根据图标 ID 获取图片 URL
   *
   * @param icon 图标 ID
   */
  private getImageUrl(icon: string): string {
    return AliyunOssConfig.admin.url + '/static/hefeng/s2/' + icon + '.svg'
  }

  /**
   * 获取天气生活指数对应的图标
   */
  private getLivingIndexIconUrl(type: string): string {
    return AliyunOssConfig.admin.url + '/static/hefeng/live/' + type + '.svg'
  }

  /**
   * 获取实时天气数据
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getWeatherNow(locationId: string): Promise<ExtWeatherNow> {
    const weatherNow: ExtWeatherNow = await this.hefengPublicService.getWeatherNow(locationId)
    weatherNow.obsDiff = dayjs().diff(dayjs(weatherNow.obsTime), 'minute')

    return weatherNow
  }

  /**
   * 获取逐天天气预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getDailyForecast(days: 3 | 7 | 10 | 15, locationId: string): Promise<ExtDailyForecastItem[]> {
    const list = await this.hefengPublicService.getDailyForecast(days, locationId)
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
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getHourlyForecast(hours: 24 | 72 | 168, locationId: string): Promise<ExtHourlyForecastItem[]> {
    const list = await this.hefengPublicService.getHourlyForecast(hours, locationId)
    return list.map((item: ExtHourlyForecastItem) => {
      item.iconUrl = this.getIconUrl(item.icon)
      item.time = item.fxTime.substring(11, 16)

      return plainToClass(ExtHourlyForecastItem, item)
    })
  }

  /**
   * 获取天气生活指数
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getLivingIndex(locationId: string): Promise<ExtLivingIndexItem[]> {
    const list = await this.hefengPublicService.getLivingIndex(locationId)
    return list.map((item: ExtLivingIndexItem) => {
      item.iconUrl = this.getLivingIndexIconUrl(item.type)

      return plainToClass(ExtLivingIndexItem, item)
    })
  }

  /**
   * 获取实时空气质量
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getAirNow(locationId: string): Promise<ExtAirNow> {
    const airNow = await this.hefengPublicService.getAirNow(locationId)

    return plainToClass(ExtAirNow, airNow)
  }

  /**
   * 获取空气质量预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-daily-forecast/)
   */
  async getAirDailyForecast(locationId: string): Promise<ExtAirDailyForecastItem[]> {
    const list = await this.hefengPublicService.getAirDailyForecast(locationId)
    return list.map((item: ExtAirDailyForecastItem) => {
      item.date = item.fxDate

      return plainToClass(ExtAirDailyForecastItem, item)
    })
  }

  /**
   * 获取分钟级降水
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getMinutelyRain(longitude: number, latitude: number): Promise<ExtMinutelyRainItem[]> {
    const list = await this.hefengPublicService.getMinutelyRain(longitude, latitude)
    return list.map((item: ExtMinutelyRainItem) => {
      item.time = item.fxTime.substring(11, 16)
      item.height = (parseFloat(item.precip) * 200 + 10).toFixed(0)

      return plainToClass(ExtMinutelyRainItem, item)
    })
  }

  /**
   * 获取天气灾害预警
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/warning/weather-warning/)
   */
  async getWarningNow(locationId: string): Promise<WarningNowItem[]> {
    return this.hefengPublicService.getWarningNow(locationId)
  }

  /**
   * 将所有天气项目合并输出
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getCombinedWeather(locationId: string): Promise<CombinedWeather>

  /**
   * 将所有天气项目合并输出
   *
   * @param locationId 和风天气的地区 `LocationID`
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getCombinedWeather(locationId: string, longitude: number, latitude: number): Promise<CombinedWeather>

  /**
   * 将所有天气项目合并输出
   */
  async getCombinedWeather(locationId: string, longitude?: number, latitude?: number): Promise<CombinedWeather> {
    const promises = []

    promises.push(this.getWeatherNow(locationId))
    promises.push(this.getDailyForecast(15, locationId))
    promises.push(this.getHourlyForecast(24, locationId))
    promises.push(this.getAirNow(locationId))
    promises.push(this.getAirDailyForecast(locationId))
    promises.push(this.getLivingIndex(locationId))
    promises.push(this.getWarningNow(locationId))

    if (typeof longitude === 'number' && typeof latitude === 'number') {
      promises.push(this.getMinutelyRain(longitude, latitude))
    }

    const [now, f15d, f24h, airnow, air5d, livingIndex, warning, rain] = await Promise.all(promises)

    return { now, f15d, f24h, airnow, air5d, livingIndex, warning, rain }
  }
}
