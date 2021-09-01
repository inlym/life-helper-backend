import { Injectable, Logger } from '@nestjs/common'
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
import { Redis } from 'ioredis'
import { RedisService } from 'nestjs-redis'
import { HefengHttpService } from './hefeng-http.service'

/**
 * ### 模块说明
 *
 * ```markdown
 * 1. 与 `HefengHttpService` 中的方法一一对应，逐个增加 `缓存处理`。
 * 2. 缓存存入 `Redis` 中。
 * 3. 每个 API 的缓存时效均不同。
 * ```
 *
 *
 * ### 注意事项
 *
 * ```markdown
 * 1. 各个请求的 `请求参数` 以及函数的格式几乎完全一致，可以封装成 `type -> apiInfo` 的形式去请求接口，只需要一个函数就够了，
 * 而不是每一个对应的 API 都使用了一个函数（当前文件的方案），但千万不要这么做。
 * 2. 上述做法的缺点是都写在一个函数内，里面需要有各种冗余的判断，会被限制住，处理差异性参数非常麻烦。
 * 3. 当前版本就是从上述的版本改过来的，不要再重蹈覆辙了（宁可每个方法都有很多重复的代码），这样一劳永逸。
 * ```
 */
@Injectable()
export class HefengCachedService {
  /** 日志工具 */
  private readonly logger = new Logger(HefengCachedService.name)

  private readonly redis: Redis

  constructor(private redisService: RedisService, private readonly hefengHttpService: HefengHttpService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 查询和风天气中的城市信息
   *
   * @param location 位置
   */
  async searchCity(location: string): Promise<CityInfo[]> {
    /** Redis 键名 */
    const rKey = `hefeng:city:location:${location}`

    /** 缓存时长：10天 */
    const expiration = 60 * 60 * 24 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.searchCity(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 热门城市查询
   */
  async getTopCity(): Promise<CityInfo[]> {
    /** Redis 键名 */
    const rKey = `hefeng:city:top_city`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getTopCity()
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取实时天气数据
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getWeatherNow(location: string): Promise<WeatherNow> {
    /** Redis 键名 */
    const rKey = `hefeng:weather_now:location:${location}`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getWeatherNow(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取逐天天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   * @param days 天数
   */
  async getDailyForecast(location: string, days: 3 | 7 | 10 | 15): Promise<DailyForecastItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:daily_${days}d:location:${location}`

    /** 缓存时长：2小时 */
    const expiration = 60 * 60 * 2

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getDailyForecast(location, days)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取逐小时天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   * @param hours 小时数
   */
  async getHourlyForecast(location: string, hours: 24 | 72 | 168): Promise<HourlyForecastItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:hourly_${hours}h:location:${location}`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getHourlyForecast(location, hours)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取天气预警城市列表
   */
  async getWarningCityList(): Promise<WarningCity[]> {
    /** Redis 键名 */
    const rKey = `hefeng:city:warning_city`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getWarningCityList()
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取天气生活指数
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getLivingIndexItem(location: string): Promise<LivingIndexItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:living_index:location:${location}`

    /** 缓存时长：20分钟 */
    const expiration = 60 * 20

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getLivingIndexItem(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取实时空气质量
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getAirNow(location: string): Promise<AirNow> {
    /** Redis 键名 */
    const rKey = `hefeng:air_now:location:${location}`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getAirNow(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取空气质量预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getAirDailyForecast(location: string): Promise<AirDailyForecastItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:air_daily:location:${location}`

    /** 缓存时长：4小时 */
    const expiration = 60 * 60 * 4

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getAirDailyForecast(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取分钟级降水
   *
   * @param location 需要查询地区的以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getMinutelyRain(location: string): Promise<MinutelyRainItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:rain:location:${location}`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getMinutelyRain(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }

  /**
   * 获取天气灾害预警
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   */
  async getWarningNow(location: string): Promise<WarningNowItem[]> {
    /** Redis 键名 */
    const rKey = `hefeng:warning_now:location:${location}`

    /** 缓存时长：10分钟 */
    const expiration = 60 * 10

    const result = await this.redis.get(rKey)
    if (result) {
      return JSON.parse(result)
    } else {
      const res = await this.hefengHttpService.getWarningNow(location)
      await this.redis.set(rKey, JSON.stringify(res), 'EX', expiration)
      return res
    }
  }
}
