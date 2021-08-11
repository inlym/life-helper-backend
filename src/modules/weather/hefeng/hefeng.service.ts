/**
 * ═════════════════════════════   说明   ═════════════════════════════════
 *
 * - 当前服务用于对和风天气 API 做二次封装处理，用于外层调用
 *
 * ════════════════════════════════════════════════════════════════════════
 */

import { Injectable, Logger } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as dayjs from 'dayjs'
import { AliyunOssConfig } from 'life-helper-config'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengApiService } from './hefeng-api.service'
import { CityInfo } from './hefeng.interface'
import {
  AirDailyForecastItem,
  AirDailyForecastResponse,
  AirNow,
  AirNowResponse,
  GridWeatherMinutelyItem,
  GridWeatherMinutelyResponse,
  LivingIndexItem,
  LivingIndexResponse,
  WeatherDailyForecastItem,
  WeatherDailyForecastResponse,
  WeatherHourlyForecastItem,
  WeatherHourlyForecastResponse,
  WeatherNow,
  WeatherNowResponse,
} from './hefeng.model'

export type DailyType = 'weather-15d' | 'weather-7d'
export type HourlyType = 'weather-24h'

@Injectable()
export class HefengService {
  private readonly logger = new Logger(HefengService.name)

  private readonly iconPath = AliyunOssConfig.admin.url + '/static/hefeng/c1/'
  private readonly imagePath = AliyunOssConfig.admin.url + '/static/hefeng/s2/'
  private readonly weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  constructor(private readonly hefengApiService: HefengApiService, private readonly lbsqqService: LbsqqService) {}

  /**
   * 城市信息查询
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getCityInfo(locationId: string): Promise<CityInfo>

  /**
   * 城市信息查询
   *
   * @see [开发文档](https://dev.qweather.com/docs/api/geo/city-lookup/)
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getCityInfo(longitude: number, latitude: number): Promise<CityInfo>

  async getCityInfo(first: string | number, second?: number): Promise<CityInfo> {
    if (typeof first === 'number' && typeof second === 'number') {
      const longitude = first.toFixed(2)
      const latitude = second.toFixed(2)
      const location = `${longitude},${latitude}`
      return this.hefengApiService.lookupCity(location)
    } else if (typeof first === 'string' && typeof second === 'undefined') {
      return this.hefengApiService.lookupCity(first)
    } else {
      // 空
    }
  }

  /**
   * 热门城市查询
   *
   * @see [开发文档](https://dev.qweather.com/docs/api/geo/top-city/)
   */
  async getTopCity(): Promise<CityInfo[]> {
    return this.hefengApiService.topCity()
  }

  /**
   * 获取和风天气体系中的 `LocationID`
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getLocationId(longitude: number, latitude: number): Promise<string> {
    const result = await this.getCityInfo(longitude, latitude)
    return result.id
  }

  /**
   * 获取当前实时天气
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getWeatherNow(locationId: string): Promise<WeatherNow> {
    const response: WeatherNowResponse = await this.hefengApiService.getData('weather-now', locationId)
    const result = response.now

    const diff = dayjs().diff(dayjs(response.updateTime), 'minutes')
    if (diff < 5) {
      result.updateTime = `刚刚更新`
    } else {
      result.updateTime = `${diff}分钟前更新`
    }

    result.updateTime = response.updateTime
    result.summary = `现在${result.text}，温度 ${result.temp} 度。当前湿度 ${result.humidity}%，${result.windDir} ${result.windScale} 级，风速 ${result.windSpeed}km/h`

    return plainToClass(WeatherNow, result)
  }

  /**
   * 获取逐天天气预报
   *
   * @param locationId
   * @param dailyType
   */
  async getWeatherDailyForecast(locationId: string, dailyType: DailyType): Promise<WeatherDailyForecastItem[]> {
    const response: WeatherDailyForecastResponse = await this.hefengApiService.getData(dailyType, locationId)

    return response.daily.map((item: WeatherDailyForecastItem) => {
      item.iconDayUrl = this.iconPath + item.iconDay + '.svg'
      item.iconNightUrl = this.iconPath + item.iconNight + '.svg'
      item.imageUrl = this.imagePath + item.iconDay + '.png'

      // 添加 `date` 属性，格式：`2021-06-23`
      item.date = item.fxDate

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

      return plainToClass(WeatherDailyForecastItem, item)
    })
  }

  /**
   * 获取逐小时天气预报
   *
   * @param locationId 和风天气的 `LocationId`
   * @param hourlyType 目前仅 '24h'
   */
  async getWeatherHourlyForecast(locationId: string, hourlyType: HourlyType): Promise<WeatherHourlyForecastItem[]> {
    const response: WeatherHourlyForecastResponse = await this.hefengApiService.getData(hourlyType, locationId)
    return response.hourly.map((item: WeatherHourlyForecastItem) => {
      item.iconUrl = this.iconPath + item.icon + '.svg'
      item.time = item.fxTime

      return plainToClass(WeatherHourlyForecastItem, item)
    })
  }

  /**
   * 获取实时空气质量
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getAirNow(locationId: string): Promise<AirNow> {
    const response: AirNowResponse = await this.hefengApiService.getData('air-now', locationId)
    return plainToClass(AirNow, response.now)
  }

  /**
   * 获取未来 5 天空气质量预报
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getAirDailyForecast(locationId: string): Promise<AirDailyForecastItem[]> {
    const response: AirDailyForecastResponse = await this.hefengApiService.getData('air-5d', locationId)
    return response.daily.map((item: AirDailyForecastItem) => {
      item.date = item.fxDate
      return plainToClass(AirDailyForecastItem, item)
    })
  }

  /**
   * 获取天气生活指数
   */
  async getLivingIndex(locationId: string): Promise<LivingIndexItem[]> {
    const response: LivingIndexResponse = await this.hefengApiService.getData('indices-1d', locationId)
    const iconUrlPrefix = 'https://img.lh.inlym.com/static/hefeng/live/'

    return response.daily.map((item: LivingIndexItem) => {
      item.iconUrl = iconUrlPrefix + item.type + '.svg'
      return plainToClass(LivingIndexItem, item)
    })
  }

  /**
   * 获取分钟级降水
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getGridWeatherMinutely(longitude: number, latitude: number): Promise<GridWeatherMinutelyResponse> {
    const lng = longitude.toFixed(2)
    const lat = latitude.toFixed(2)
    const location = `${lng},${lat}`

    const response: GridWeatherMinutelyResponse = await this.hefengApiService.getData('minutely-5m', location)

    response.list = response.minutely.map((item: GridWeatherMinutelyItem) => {
      item.time = item.fxTime.substring(11, 16)
      item.height = (parseFloat(item.precip) * 200 + 10).toFixed(0)
      return plainToClass(GridWeatherMinutelyItem, item)
    })

    return plainToClass(GridWeatherMinutelyResponse, response)
  }

  /**
   * 将 IP 地址转化为和风天气的 `LocationID`
   *
   * @param ip IP 地址
   */
  async getLocationIdByIp(ip: string): Promise<string> {
    const { longitude, latitude } = await this.lbsqqService.getCoordinateByIp(ip)
    return await this.getLocationId(longitude, latitude)
  }
}
