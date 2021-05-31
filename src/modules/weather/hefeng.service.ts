import { Injectable } from '@nestjs/common'
import { hefeng } from 'src/config'
import { RedisService } from 'nestjs-redis'
import { HfOptions } from './weather.interface'
import axios from 'axios'

@Injectable()
export class HefengService {
  constructor(private redisService: RedisService) {}

  get profile() {
    return {
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
       * 逐天天气预报 - 7 天
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
  }

  /**
   * 发送 HTTP 请求获取数据
   */
  async fetchData(type: string, location: string) {
    const { mode, url } = this.profile[type]
    const { baseURL, key } = hefeng[mode]
    const requestOptions = { baseURL, url, params: { key, location } }
    const { data: resData } = await axios(requestOptions)

    if (resData.code === '200') {
      return resData
    } else {
      throw new Error(`[接口请求错误] 和风天气 - \`${type}\`, 响应 code => \`${resData.code}\`，参数 location => \`${location}\` `)
    }
  }

  /**
   * 加入了缓存判断的获取数据（封装了转化 location）
   */
  async getData(options: HfOptions) {
    const { type, locationId, longitude, latitude } = options

    let location: string
    if (locationId) {
      location = locationId
    } else if (longitude && latitude) {
      const lng = longitude.toFixed(2)
      const lat = latitude.toFixed(2)
      location = `${lng},${lat}`
    }

    const redisKey = `hefeng:${type}:location:${location}`
    const redis = this.redisService.getClient()
    const redisResult = await redis.get(redisKey)
    if (redisResult) {
      return JSON.parse(redisResult)
    }

    const resData = await this.fetchData(type, location)
    const { expiration } = this.profile[type]
    await redis.set(redisKey, JSON.stringify(resData), 'EX', expiration)
    return resData
  }
}
