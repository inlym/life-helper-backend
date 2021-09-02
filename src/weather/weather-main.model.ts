import { WeatherUnion } from './hefeng/hefeng-public.model'
import { WeatherCity } from './weather-city/weather-city.entity'

export interface LocationCoordinate {
  longitude: number
  latitude: number
}

export class MixedWeather extends WeatherUnion {
  /** 地点名称 */
  locationName: string

  /** 当前展示的天气城市 ID */
  cityId?: number

  /** 用户关注的天气城市列表 */
  cities?: WeatherCity[]
}

export interface GetWeatherOptions {
  /** 用户 ID */
  userId: number

  /** 天气城市 ID */
  cityId: number

  /** 以逗号分隔的经纬度坐标 */
  location: string

  /** IP 地址 */
  ip: string
}
