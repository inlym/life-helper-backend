/**
 * 可以获取的天气数据类型
 */
export type HefengApiType =
  | 'weather-now'
  | 'weather-7d'
  | 'weather-15d'
  | 'weather-24h'
  | 'minutely-5m'
  | 'grid-now'
  | 'grid-3d'
  | 'grid-24h'
  | 'indices-1d'
  | 'warning-now'
  | 'warning-list'
  | 'air-now'
  | 'air-5d'

export interface ProfileItem {
  mode: string
  url: string
  expiration: number
}

interface HefengRequestParams {
  key: string
  location: string
  type?: string | number
}

export interface HefengRequestOptions {
  baseURL: string
  url: string
  params: HefengRequestParams
}

/** 和风天气接口响应数据 - 城市信息查询 */
export interface CityInfo {
  /** 地区/城市名称 */
  name: string

  /** 地区/城市ID */
  id: string

  /** 地区/城市纬度 */
  lat: string

  /** 地区/城市经度 */
  lon: string

  /** 地区/城市的上级行政区划名称 */
  adm2: string

  /** 地区/城市所属一级行政区域 */
  adm1: string

  /** 地区/城市所属国家名称 */
  country: string

  /** 地区/城市所在时区 */
  tz: string

  /** 地区/城市目前与UTC时间偏移的小时数 */
  utcOffset: string

  /**
   * 地区/城市是否当前处于夏令时
   * 1 表示当前处于夏令时
   * 0 表示当前不是夏令时
   */
  isDst: string

  /** 地区/城市的属性 */
  type: string

  /** 地区评分 */
  rank: string
}

/** 和风天气接口响应数据 */
export interface HefengResponseData {
  /** API状态码 */
  code: string

  /** 城市信息查询 */
  location?: CityInfo[]

  /** 热门城市查询 */
  topCityList?: CityInfo[]
}
