/** 和风天气接口响应数据基本格式 */
export interface HefengResponse {
  /** API状态码 */
  code: string

  /** 城市信息查询 */
  location?: CityInfo[]

  /** 热门城市查询 */
  topCityList?: CityInfo[]
}

/** 和风天气接口响应数据 - 城市信息查询 */

/**
 * `城市信息查询` 接口主要数据
 *
 * @see [城市信息查询](https://dev.qweather.com/docs/api/geo/city-lookup/)
 */
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
