import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { HefengConfig } from 'life-helper-config'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { request } from 'src/common/http'
import { INVALID_LOCATION } from './hefeng-error.constant'
import {
  AirDailyForecastItem,
  AirNow,
  CityInfo,
  DailyForecastItem,
  HefengResponse,
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
 * 1. 封装对 [和风天气](https://dev.qweather.com/docs/api/) API 的请求。
 * 2. 仅将请求参数封装为函数，不做缓存处理。
 * 3. 仅返回响应数据中的有效数据部分，不是将整个响应都返回的。
 * ```
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
export class HefengHttpService {
  /** 日志工具 */
  private readonly logger = new Logger(HefengHttpService.name)

  /**
   * 由于使用了无效的 `location` 数据，而返回的 `code`
   *
   * @see
   * [错误状态码](https://dev.qweather.com/docs/start/status-code/)
   *
   *
   * @description
   *
   * ### 状态码说明
   *
   * ```markdown
   * 1. `code` 指的是响应数据中的 `code` 字段，而不是响应状态码。
   * 2. `204` 含义：请求成功，但你查询的地区暂时没有你需要的数据。
   * 3. `400` 含义：请求错误，可能包含错误的请求参数或缺少必选的请求参数。（实测使用地名进行城市查询，没找到也会报这个错，因此把它也加上）
   * 4. `404` 含义：查询的数据或地区不存在。
   * ```
   */
  private readonly invalidLocationCodes = ['204', '400', '404']

  /**
   * 查询和风天气中的城市信息
   *
   * @param location 位置
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/geo/city-lookup/)
   *
   * @description
   *
   * ### `location` 支持的形式：
   *
   * ```markdown
   * 1. 查询地区的名称，支持模糊搜索。例如 `西安`。
   * 2. 以英文逗号分隔的经度,纬度坐标（十进制），例如 `116.41,39.92`。
   * 3. 和风天气内部定义的 `LocationID`。
   * 4. 行政区划编码 `Adcode`。
   * ```
   */
  async searchCity(location: string): Promise<CityInfo[]> {
    const { key } = HefengConfig.basic

    const response = await request<HefengResponse>({
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      params: {
        key,
        location,

        /** 搜索范围: 中国城市范围 */
        range: 'cn',

        /** 返回结果的数量 */
        number: 10,

        /** 语言: 中文 */
        lang: 'zh',
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.location
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 城市信息查询, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 热门城市查询
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/geo/top-city/)
   */
  async getTopCity(): Promise<CityInfo[]> {
    const { key } = HefengConfig.basic

    const response = await request<HefengResponse>({
      url: 'https://geoapi.qweather.com/v2/city/top',
      params: {
        key,

        /** 搜索范围 */
        range: 'cn',

        /** 返回结果的数量，取值范围 1-20 */
        number: 20,

        /** 语言: 中文 */
        lang: 'zh',
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.topCityList
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 热门城市查询, 响应 code => \`${response.data.code}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取实时天气数据
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-now/)
   */
  async getWeatherNow(location: string): Promise<WeatherNow> {
    const { key, baseURL } = HefengConfig.basic

    const response = await request<HefengResponse>({
      baseURL,
      url: '/weather/now',
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.now as WeatherNow
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 实时天气, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取逐天天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   * @param days 天数
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
   */
  async getDailyForecast(location: string, days: 3 | 7 | 10 | 15): Promise<DailyForecastItem[]> {
    /**
     * 说明：
     * 1. 3 天和 7 天使用开发版。
     * 2. 10 天 和 15 天使用商业版。
     */
    const { key, baseURL } = [10, 15].includes(days) ? HefengConfig.pro : HefengConfig.basic

    const response = await request<HefengResponse>({
      baseURL,
      url: `/weather/${days}d`,
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.daily as DailyForecastItem[]
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 逐天天气预报, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取逐小时天气预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   * @param hours 小时数
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/)
   */
  async getHourlyForecast(location: string, hours: 24 | 72 | 168): Promise<HourlyForecastItem[]> {
    const { key, baseURL } = hours === 24 ? HefengConfig.basic : HefengConfig.pro

    const response = await request<HefengResponse>({
      baseURL,
      url: `/weather/${hours}h`,
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.hourly as HourlyForecastItem[]
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 逐小时天气预报, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取天气预警城市列表
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/warning/weather-warning-city-list/)
   */
  async getWarningCityList(): Promise<WarningCity[]> {
    const { key } = HefengConfig.basic

    const response = await request<HefengResponse>({
      url: 'https://devapi.qweather.com/v7/warning/list',
      params: {
        key,
        range: 'cn',
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.warningLocList
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 天气预警城市列表, 响应 code => \`${response.data.code}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取天气生活指数
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/indices/)
   */
  async getLivingIndexItem(location: string): Promise<LivingIndexItem[]> {
    const { key, baseURL } = HefengConfig.basic

    const response = await request<HefengResponse>({
      baseURL,
      url: '/indices/1d',
      params: {
        key,
        location,
        type: 0,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.daily as LivingIndexItem[]
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 天气生活指数, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取实时空气质量
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-now/)
   */
  async getAirNow(location: string): Promise<AirNow> {
    const { key, baseURL } = HefengConfig.basic

    const response = await request<HefengResponse>({
      baseURL,
      url: '/air/now',
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.now as AirNow
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 实时空气质量, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取空气质量预报
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/air/air-daily-forecast/)
   */
  async getAirDailyForecast(location: string): Promise<AirDailyForecastItem[]> {
    const { key, baseURL } = HefengConfig.pro

    const response = await request<HefengResponse>({
      baseURL,
      url: '/air/5d',
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.daily as AirDailyForecastItem[]
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 空气质量预报, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取分钟级降水
   *
   * @param location 需要查询地区的以英文逗号分隔的 `经度,纬度` 坐标（十进制）
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
  async getMinutelyRain(location: string): Promise<MinutelyRainItem[]> {
    const { key, baseURL } = HefengConfig.pro

    const response = await request<HefengResponse>({
      baseURL,
      url: '/minutely/5m',
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.minutely
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 分钟级降水, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  /**
   * 获取天气灾害预警
   *
   * @param location 需要查询地区的 `LocationID` 或以英文逗号分隔的 `经度,纬度` 坐标（十进制）
   *
   * @see
   * [API 开发文档](https://dev.qweather.com/docs/api/warning/weather-warning/)
   */
  async getWarningNow(location: string): Promise<WarningNowItem[]> {
    const { key, baseURL } = HefengConfig.basic

    const response = await request<HefengResponse>({
      baseURL,
      url: '/warning/now',
      params: {
        key,
        location,
      },
    })

    if (response.data.code === '200') {
      // `code` 为 `200` 表示请求成功
      return response.data.warning
    } else {
      // 失败情况
      this.logger.error(`[接口请求错误] 和风天气 - 天气灾害预警, 响应 code => \`${response.data.code}\`,  location => \`${location}\` `)

      if (this.invalidLocationCodes.includes(response.data.code)) {
        throw new HttpException(INVALID_LOCATION, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
