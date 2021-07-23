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
export interface HefengResponseDataLocationItem {
  /** 地区/城市名称 */
  name: string

  /** 地区/城市ID */
  id: string
}

/** 和风天气接口响应数据 */
export interface HefengResponseData {
  /** API状态码 */
  code: string

  location?: HefengResponseDataLocationItem[]
}
