import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { HefengConfig } from 'life-helper-config'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { CityInfo, HefengResponse } from './hefeng-http.interface'

/**
 * ### 模块说明
 *
 * ```markdown
 * 1. 封装对 [和风天气](https://dev.qweather.com/docs/api/) API 的请求。
 * 2. 仅将请求参数封装为函数，不做缓存处理。
 * 3. 仅返回响应数据中的有效数据部分，不是将整个响应都返回的。
 * ```
 */
@Injectable()
export class HefengHttpService {
  /** 日志工具 */
  private readonly logger = new Logger(HefengHttpService.name)

  /**
   * 查询和风天气中的城市信息
   *
   * @param location 位置
   *
   * @see [城市信息查询](https://dev.qweather.com/docs/api/geo/city-lookup/)
   *
   * @description
   *
   * ```markdown
   * #### `location` 支持的形式：
   *
   * 1. 查询地区的名称，支持模糊搜索。例如 `西安`。
   * 2. 以英文逗号分隔的经度,纬度坐标（十进制），例如 `116.41,39.92`。
   * 3. 和风天气内部定义的 `LocationID`。
   * 4. 行政区划编码 `Adcode`。
   * ```
   */
  async searchCity(location: string): Promise<CityInfo[]> {
    const { key } = HefengConfig.basic

    const response = await axios.request<HefengResponse>({
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

      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * 热门城市查询
   *
   * @see [热门城市查询](https://dev.qweather.com/docs/api/geo/top-city/)
   */
  async getTopCity(): Promise<CityInfo[]> {
    const { key } = HefengConfig.basic

    const response = await axios.request<HefengResponse>({
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

      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
