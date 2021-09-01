import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { HefengCachedService } from './hefeng-cached.service'
import { INVALID_LOCATION } from './hefeng-error.constant'
import {
  AirDailyForecastItem,
  AirNow,
  CityInfo,
  DailyForecastItem,
  HourlyForecastItem,
  LivingIndexItem,
  MinutelyRainItem,
  WarningCity,
  WarningNowItem,
  WeatherNow,
} from './hefeng-http.model'

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

  constructor(private readonly hefengCachedService: HefengCachedService) {}

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
   */
  async getWeatherNow(locationId: string): Promise<WeatherNow>

  /**
   * 获取实时天气数据
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getWeatherNow(longitude: number, latitude: number): Promise<WeatherNow>

  /**
   * 获取实时天气数据
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-now/)
   */
  async getWeatherNow(first: number | string, second?: number): Promise<WeatherNow> {
    const location = this.transformLocationParams(first, second)
    return await this.hefengCachedService.getWeatherNow(location)
  }

  /**
   * 获取逐天天气预报
   *
   * @param days 天数
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getDailyForecast(days: 3 | 7 | 10 | 15, locationId: string): Promise<DailyForecastItem[]>

  /**
   * 获取逐天天气预报
   *
   * @param days 天数
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getDailyForecast(days: 3 | 7 | 10 | 15, longitude: number, latitude: number): Promise<DailyForecastItem[]>

  /**
   * 获取逐小时天气预报
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
   */
  async getDailyForecast(days: 3 | 7 | 10 | 15, first: number | string, second?: number): Promise<DailyForecastItem[]> {
    const location = this.transformLocationParams(first, second)
    return this.hefengCachedService.getDailyForecast(location, days)
  }

  /**
   * 获取逐小时天气预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   */
  async getHourlyForecast(hours: 24 | 72 | 168, locationId: string): Promise<HourlyForecastItem[]>

  /**
   * 获取逐小时天气预报
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getHourlyForecast(hours: 24 | 72 | 168, longitude: number, latitude: number): Promise<HourlyForecastItem[]>

  /**
   * 获取未来 24 小时的逐小时天气预报
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/)
   */
  async getHourlyForecast(hours: 24 | 72 | 168, first: number | string, second?: number): Promise<HourlyForecastItem[]> {
    const location = this.transformLocationParams(first, second)
    return this.hefengCachedService.getHourlyForecast(location, hours)
  }

  /**
   * 获取天气预警城市列表
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/warning/weather-warning-city-list/)
   */
  async getWarningCityList(): Promise<WarningCity[]> {
    return this.hefengCachedService.getWarningCityList()
  }

  /**
   * 获取天气生活指数
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/indices/)
   */
  async getLivingIndex(locationId: string): Promise<LivingIndexItem[]> {
    const location = locationId
    return this.hefengCachedService.getLivingIndex(location)
  }

  /**
   * 获取实时空气质量
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-now/)
   */
  async getAirNow(locationId: string): Promise<AirNow> {
    const location = locationId
    return this.hefengCachedService.getAirNow(location)
  }

  /**
   * 获取空气质量预报
   *
   * @param locationId 和风天气的地区 `LocationID`
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-daily-forecast/)
   */
  async getAirDailyForecast(locationId: string): Promise<AirDailyForecastItem[]> {
    const location = locationId
    return this.hefengCachedService.getAirDailyForecast(location)
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
  async getMinutelyRain(longitude: number, latitude: number): Promise<MinutelyRainItem[]> {
    const location = this.transformCoordinate(longitude, latitude)
    return this.hefengCachedService.getMinutelyRain(location)
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
    const location = locationId
    return this.hefengCachedService.getWarningNow(location)
  }
}
