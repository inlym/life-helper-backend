/** 和风天气接口响应数据基本格式 */
export interface HefengResponse {
  /** API状态码 */
  code: string

  /** 城市信息查询 */
  location: CityInfo[]

  /** 热门城市查询 */
  topCityList: CityInfo[]

  /** 实时天气数据 */
  now: WeatherNow

  /** 逐天天气预报 */
  dayly: DailyForecastItem[]

  /** 逐小时天气预报 */
  hourly: HourlyForecastItem[]
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

/**
 * 实时天气数据
 *
 * @see [实时天气](https://dev.qweather.com/docs/api/weather/weather-now/)
 */
export class WeatherNow {
  /** 数据观测时间 */
  obsTime: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 体感温度，默认单位：摄氏度 */
  feelsLike: string

  /** 天气状况和图标的代码 */
  icon: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  text: string

  /** 风向360角度 */
  wind360: string

  /** 风向 */
  windDir: string

  /** 风力等级 */
  windScale: string

  /** 风速，公里/小时 */
  windSpeed: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string

  /** 云量，百分比数值 */
  cloud: string

  /** 露点温度 */
  dew: string
}

/**
 * 逐天天气预报
 *
 * @see [逐天天气预报](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
 */
export class DailyForecastItem {
  // 以下为原始数据（未做处理）

  /** 预报日期 */
  date: string

  fxDate: string

  /** 日出时间 */
  sunrise: string

  /** 日落时间 */
  sunset: string

  /** 月升时间 */
  moonrise: string

  /** 月落时间 */
  moonset: string

  /** 月相名称 */
  moonPhase: string

  /** 最高温度 */
  tempMax: string

  /** 最低温度 */
  tempMin: string

  /** 白天天气状况的图标代码 */
  iconDay: string

  /** 白天天气状况文字描述 */
  textDay: string

  /** 夜间天气状况的图标代码 */
  iconNight: string

  /** 夜间天气状况文字描述 */
  textNight: string

  /** 白天风向360角度 */
  wind360Day: string

  /** 白天风向 */
  windDirDay: string

  /** 白天风力等级 */
  windScaleDay: string

  /** 白天风速，公里/小时 */
  windSpeedDay: string

  /** 夜间风向360角度 */
  wind360Night: string

  /** 夜间当天风向 */
  windDirNight: string

  /** 夜间风力等级 */
  windScaleNight: string

  /** 夜间风速，公里/小时 */
  windSpeedNight: string

  /** 当天总降水量，默认单位：毫米 */
  precip: string

  /** 紫外线强度指数 */
  uvIndex: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 能见度，默认单位：公里 */
  vis: string

  /** 云量，百分比数值 */
  cloud: string
}

/**
 * 逐小时天气预报
 *
 * @see [逐小时天气预报](https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/)
 */
export class HourlyForecastItem {
  /** 预报时间 */
  fxTime: string

  /** 温度，默认单位：摄氏度 */
  temp: string

  /** 天气状况和图标的代码 */
  icon: string

  /** 天气状况的文字描述 */
  text: string

  /** 风向360角度 */
  wind360: string

  /** 风向 */
  windDir: string

  /** 风力等级 */
  windScale: string

  /** 风速，公里/小时 */
  windSpeed: string

  /** 相对湿度，百分比数值 */
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  precip: string

  /** 逐小时预报降水概率，百分比数值，可能为空 */
  pop: string

  /** 大气压强，默认单位：百帕 */
  pressure: string

  /** 云量，百分比数值 */
  cloud: string

  /** 露点温度 */
  dew: string
}
