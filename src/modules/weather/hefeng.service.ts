/**
 * ╔═════════════════════════════   说明   ═════════════════════════════════
 * ║
 * ╟── 1. 当前服务（`HefengService`）只做以下 2 件事：
 * ║       - 封装对和风天气 API 的请求。
 * ║       - 对请求结果附加缓存逻辑。
 * ╟── 2. 当前服务不对返回结果做任何数据处理（数据处理过程在 `WeatherService` 服务中）。
 * ║
 * ╚════════════════════════════════════════════════════════════════════════
 */

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import request from 'axios'
import { Redis } from 'ioredis'
import { HefengConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { HefengApiType, HefengRequestOptions, HefengResponseData, ProfileItem } from './hefeng.interface'

@Injectable()
export class HefengService {
  private readonly logger = new Logger(HefengService.name)
  private readonly profile: Record<string, ProfileItem> = {
    /**
     * 实时天气
     * @see https://dev.qweather.com/docs/api/weather/weather-now/
     */
    'weather-now': {
      mode: 'basic',
      url: '/weather/now',
      expiration: 60 * 30,
    },

    /**
     * 逐天天气预报 - 7 天
     * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
     */
    'weather-7d': {
      mode: 'basic',
      url: '/weather/7d',
      expiration: 60 * 60 * 3,
    },

    /**
     * 逐天天气预报 - 15 天
     * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
     */
    'weather-15d': {
      mode: 'pro',
      url: '/weather/15d',
      expiration: 60 * 60 * 3,
    },

    /**
     * 逐小时天气预报 - 24 小时
     * @see https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
     */
    'weather-24h': {
      mode: 'basic',
      url: '/weather/24h',
      expiration: 60 * 30,
    },

    /**
     * 分钟级降水
     * @see https://dev.qweather.com/docs/api/grid-weather/minutely/
     */
    'minutely-5m': {
      mode: 'pro',
      url: '/minutely/5m',
      expiration: 60 * 5,
    },

    /**
     * 格点实时天气
     * @see https://dev.qweather.com/docs/api/grid-weather/grid-weather-now/
     */
    'grid-now': {
      mode: 'pro',
      url: '/grid-weather/now',
      expiration: 60 * 5,
    },

    /**
     * 格点天气预报
     * @see https://dev.qweather.com/docs/api/grid-weather/grid-weather-daily-forecast/
     */
    'grid-3d': {
      mode: 'pro',
      url: '/grid-weather/3d',
      expiration: 60 * 30,
    },

    /**
     * 格点逐小时天气预报
     * @see https://dev.qweather.com/docs/api/grid-weather/grid-weather-hourly-forecast/
     */
    'grid-24h': {
      mode: 'pro',
      url: '/grid-weather/24h',
      expiration: 60 * 30,
    },

    /**
     * 天气生活指数
     * @see https://dev.qweather.com/docs/api/indices/
     */
    'indices-1d': {
      mode: 'basic',
      url: '/indices/1d',
      expiration: 60 * 30,
    },

    /**
     * 天气灾害预警
     * @see https://dev.qweather.com/docs/api/warning/weather-warning/
     */
    'warning-now': {
      mode: 'basic',
      url: '/warning/now',
      expiration: 60 * 5,
    },

    /**
     * 天气预警城市列表
     * @see https://dev.qweather.com/docs/api/warning/weather-warning-city-list/
     */
    'warning-list': {
      mode: 'basic',
      url: '/warning/list',
      expiration: 60 * 60 * 3,
    },

    /**
     * 实时空气质量
     * @see https://dev.qweather.com/docs/api/air/air-now/
     */
    'air-now': {
      mode: 'basic',
      url: '/air/now',
      expiration: 60 * 30,
    },

    /**
     * 空气质量预报
     * @see https://dev.qweather.com/docs/api/air/air-daily-forecast/
     */
    'air-5d': {
      mode: 'pro',
      url: '/air/5d',
      expiration: 60 * 60 * 3,
    },
  }
  private readonly redis: Redis

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 发送 HTTP 请求获取数据
   * @param type `profile` 中的键名
   * @param location 可能是 `${locationId}` 或 `${lng},${lat}`
   * @returns
   */
  async fetchData(type: HefengApiType, location: string) {
    const { mode, url } = this.profile[type]
    const { baseURL, key } = HefengConfig[mode]
    const requestOptions: HefengRequestOptions = { baseURL, url, params: { key, location } }
    if (type.startsWith('indices-')) {
      requestOptions.params.type = 0
    }
    const response = await request(requestOptions)
    const resData: HefengResponseData = response.data

    if (resData.code === '200') {
      return resData
    } else {
      this.logger.error(`调用和风天气接口出错，type => \`${type}\`, location => \`${location}\`, code => \`${resData.code}\` `)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * 加入了缓存判断的获取数据（封装了转化 location）
   */
  async getData(type: HefengApiType, location: string) {
    const redisKey = `hefeng:${type}:location:${location}`
    const redisResult = await this.redis.get(redisKey)
    if (redisResult) {
      return JSON.parse(redisResult)
    }
    const resData = await this.fetchData(type, location)
    const { expiration } = this.profile[type]
    await this.redis.set(redisKey, JSON.stringify(resData), 'EX', expiration)
    return resData
  }

  /**
   * 获取和风天气体系中的 `LocationID`
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getLocationId(longitude: number, latitude: number): Promise<string> {
    const options = {
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      params: {
        location: `${longitude},${latitude}`,
        key: HefengConfig.basic.key,
      },
    }

    const response = await request(options)
    const resData: HefengResponseData = response.data
    if (resData.code === '200') {
      return resData.location[0].id
    } else {
      this.logger.error(`[接口请求错误] 和风天气 - 城市信息查询, 响应 code => \`${resData.code}\`，参数 params => ${JSON.stringify(options.params)}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
