import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { HefengCachedService } from './hefeng-cached.service'
import { INVALID_LOCATION } from './hefeng-error.constant'
import {
  ExtAirDailyForecastItem,
  ExtAirNow,
  ExtDailyForecastItem,
  ExtHourlyForecastItem,
  ExtLivingIndexItem,
  ExtRainSurvey,
  ExtWarningCity,
  ExtWarningNowItem,
  ExtWeatherNow,
} from './hefeng-extend.model'
import { HefengExtendService } from './hefeng-extend.service'
import { CityInfo } from './hefeng-http.model'
import { WeatherUnion } from './hefeng-public.model'

/**
 * ### 模块说明
 *
 * ```markdown
 * 1. 封装对用于外部调用的方法，只封装了用得到的方法，后续按需增加。
 * ```
 *
 *
 * ### 注意事项
 *
 * ```markdown
 * 1. 只允许调用 `HefengCachedService` 中的方法，不允许直接调用 `HefengHttpService` 中的方法。
 * ```
 */
@Injectable()
export class HefengPublicService {
  /** 日志工具 */
  private readonly logger = new Logger(HefengPublicService.name)

  constructor(private readonly hefengCachedService: HefengCachedService, private readonly hefengExtendService: HefengExtendService) {}

  /**
   * 将经纬度坐标转化为以英文逗号分隔的字符串形式
   *
   * @private
   *
   * @param longitude 经度
   * @param latitude 纬度
   *
   *
   * @description
   *
   * ### 误差精度
   *
   * ```markdown
   * 1. 经纬度 `±1`，误差在 `100km` 左右。
   * 2. 经纬度 `±0.1`，误差在 `10km` 左右。
   * 3. 经纬度 `±0.01`，误差在 `1km` 左右。
   * 4. 经纬度 `±0.001`，误差在 `0.1km` 左右。
   * ```
   */
  private transformCoordinate(longitude: number, latitude: number): string {
    const lng = longitude.toFixed(2)
    const lat = latitude.toFixed(2)

    return `${lng},${lat}`
  }

  /**
   * 重载函数转化位置参数值
   *
   * @description
   *
   * ### 参数组合
   *
   * ```markdown
   * 1. `(locationId: string)`
   * 2. `(longitude: number, latitude: number)`
   * ```
   */
  private transformLocationParams(first: number | string, second?: number): string {
    if (typeof first === 'number' && typeof second === 'number') {
      return this.transformCoordinate(first, second)
    } else if (typeof first === 'string') {
      return first
    } else {
      // 一般不会走到这里
    }
  }

  /**
   * 通过经纬度坐标查询和风天气的 `LocationID`
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getLocationIdByCoordinate(longitude: number, latitude: number): Promise<string> {
    const location = this.transformCoordinate(longitude, latitude)

    const cities = await this.hefengCachedService.searchCity(location)
    if (cities.length > 0) {
      return cities[0].id
    } else {
      throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 通过地区名称模糊匹配城市信息
   *
   * @param name 地区名称
   */
  async searchCityByName(name: string): Promise<CityInfo[]> {
    return this.hefengCachedService.searchCity(name)
  }

  /**
   * 热门城市查询
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/geo/top-city/)
   */
  async getTopCity(): Promise<CityInfo[]> {
    return this.hefengCachedService.getTopCity()
  }

  /**
   * 获取实时天气数据
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-now/)
   */
  async getWeatherNow(locationId: string): Promise<ExtWeatherNow> {
    return this.hefengExtendService.getWeatherNow(locationId)
  }

  /**
   * 获取未来 7 天逐天天气预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async get7dForecast(locationId: string): Promise<ExtDailyForecastItem[]> {
    return this.hefengExtendService.getDailyForecast(locationId, 7)
  }

  /**
   * 获取未来 15 天逐天天气预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async get15dForecast(locationId: string): Promise<ExtDailyForecastItem[]> {
    return this.hefengExtendService.getDailyForecast(locationId, 15)
  }

  /**
   * 获取未来 24 小时天气预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async get24hForecast(locationId: string): Promise<ExtHourlyForecastItem[]> {
    return this.hefengExtendService.getHourlyForecast(locationId, 24)
  }

  /**
   * 获取天气生活指数
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/indices/)
   */
  async getLivingIndex(locationId: string): Promise<ExtLivingIndexItem[]> {
    return this.hefengExtendService.getLivingIndex(locationId)
  }

  /**
   * 获取实时空气质量
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-now/)
   */
  async getAirNow(locationId: string): Promise<ExtAirNow> {
    return this.hefengExtendService.getAirNow(locationId)
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
    return this.hefengExtendService.getAirDailyForecast(locationId)
  }

  /**
   * 获取分钟级降水
   *
   * @param longitude 经度
   * @param latitude 纬度
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/grid-weather/minutely/)
   *
   *
   * @description
   *
   * ### 注意事项
   *
   * ```markdown
   * 1. 当前接口的 `location` 参数不支持使用 `LocationID`。
   * ```
   */
  async getMinutelyRain(longitude: number, latitude: number): Promise<ExtRainSurvey> {
    const location = this.transformCoordinate(longitude, latitude)
    return this.hefengExtendService.getMinutelyRain(location)
  }

  /**
   * 获取天气预警城市列表
   */
  async getWarningCityList(): Promise<ExtWarningCity[]> {
    return this.hefengExtendService.getWarningCityList()
  }

  /**
   * 获取天气灾害预警
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/warning/weather-warning/)
   */
  async getWarningNow(locationId: string): Promise<ExtWarningNowItem[]> {
    return this.hefengExtendService.getWarningNow(locationId)
  }

  /**
   * 将天气数据进行合并
   *
   * @param locationId 和风天气的地区 `LocationID`
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getWeatherUnion(locationId: string, longitude: number, latitude: number): Promise<WeatherUnion> {
    const promises = []

    promises.push(this.getWeatherNow(locationId))
    promises.push(this.get15dForecast(locationId))
    promises.push(this.get24hForecast(locationId))
    promises.push(this.getLivingIndex(locationId))
    promises.push(this.getAirNow(locationId))
    promises.push(this.getAirDailyForecast(locationId))
    promises.push(this.getMinutelyRain(longitude, latitude))
    promises.push(this.getWarningNow(locationId))

    const [now, f15d, f24h, livingIndex, airnow, air5d, rain, warning] = await Promise.all(promises)

    const skyClass = this.hefengExtendService.skyClass((now as ExtWeatherNow).icon)
    return { now, f15d, f24h, livingIndex, airnow, air5d, rain, warning, skyClass }
  }
}
