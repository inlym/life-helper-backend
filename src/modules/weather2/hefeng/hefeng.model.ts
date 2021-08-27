import { Exclude, Expose } from 'class-transformer'

export interface AirNowResponse {
  now: AirNow
}

@Exclude()
export class AirDailyForecastItem {
  /** 预报日期 */
  fxDate: string

  /** 空气质量指数 */
  @Expose()
  aqi: string

  /** 空气质量指数等级 */
  @Expose()
  level: string

  /** 空气质量指数级别 */
  @Expose()
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
  @Expose()
  primary: string

  // 自定义数据

  /** 预报日期 */
  @Expose()
  date: string
}

export interface AirDailyForecastResponse {
  daily: AirDailyForecastItem[]
}

/** 实时天气数据 */
@Exclude()
export class WeatherNow {
  /** 数据观测时间 */
  obsTime: string

  /** 温度，默认单位：摄氏度 */
  @Expose()
  temp: string

  /** 体感温度，默认单位：摄氏度 */
  @Expose()
  feelsLike: string

  /** 天气状况和图标的代码 */
  @Expose()
  icon: string

  /** 天气状况的文字描述，包括阴晴雨雪等天气状态的描述 */
  @Expose()
  text: string

  /** 风向360角度 */
  @Expose()
  wind360: string

  /** 风向 */
  @Expose()
  windDir: string

  /** 风力等级 */
  @Expose()
  windScale: string

  /** 风速，公里/小时 */
  @Expose()
  windSpeed: string

  /** 相对湿度，百分比数值 */
  @Expose()
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  @Expose()
  precip: string

  /** 大气压强，默认单位：百帕 */
  @Expose()
  pressure: string

  /** 能见度，默认单位：公里 */
  @Expose()
  vis: string

  /** 云量，百分比数值 */
  cloud: string

  /** 露点温度 */
  dew: string

  /** ─────────────── 以下是自定义数据 ─────────────── */

  /** 天气总结文案 */
  @Expose()
  summary: string

  /** 当前API的最近更新时间 */
  @Expose()
  updateTime: string
}

export interface WeatherNowResponse {
  /** 当前API的最近更新时间 */
  updateTime: string

  now: WeatherNow
}

@Exclude()
export class WeatherDailyForecastItem {
  // 以下为原始数据（未做处理）

  /** 预报日期 */
  @Expose()
  date: string

  fxDate: string

  /** 日出时间 */
  @Expose()
  sunrise: string

  /** 日落时间 */
  @Expose()
  sunset: string

  /** 月升时间 */
  @Expose()
  moonrise: string

  /** 月落时间 */
  @Expose()
  moonset: string

  /** 月相名称 */
  @Expose()
  moonPhase: string

  /** 最高温度 */
  @Expose()
  tempMax: string

  /** 最低温度 */
  @Expose()
  tempMin: string

  /** 白天天气状况的图标代码 */
  @Expose()
  iconDay: string

  /** 白天天气状况文字描述 */
  @Expose()
  textDay: string

  /** 夜间天气状况的图标代码 */
  @Expose()
  iconNight: string

  /** 夜间天气状况文字描述 */
  @Expose()
  textNight: string

  /** 白天风向360角度 */
  @Expose()
  wind360Day: string

  /** 白天风向 */
  @Expose()
  windDirDay: string

  /** 白天风力等级 */
  @Expose()
  windScaleDay: string

  /** 白天风速，公里/小时 */
  @Expose()
  windSpeedDay: string

  /** 夜间风向360角度 */
  @Expose()
  wind360Night: string

  /** 夜间当天风向 */
  @Expose()
  windDirNight: string

  /** 夜间风力等级 */
  @Expose()
  windScaleNight: string

  /** 夜间风速，公里/小时 */
  @Expose()
  windSpeedNight: string

  /** 当天总降水量，默认单位：毫米 */
  @Expose()
  precip: string

  /** 紫外线强度指数 */
  @Expose()
  uvIndex: string

  /** 相对湿度，百分比数值 */
  @Expose()
  humidity: string

  /** 大气压强，默认单位：百帕 */
  @Expose()
  pressure: string

  /** 能见度，默认单位：公里 */
  @Expose()
  vis: string

  /** 云量，百分比数值 */
  @Expose()
  cloud: string

  // 以下为手工处理后的数据

  /** 昨天、今天、明天、周一、周二等格式文本 */
  @Expose()
  dayText: string

  /** `6/15` 格式的月和日文本 */
  @Expose()
  dateText: string

  /** `晴转多云` 格式的文字 */
  @Expose()
  text: string

  @Expose()
  iconDayUrl: string

  @Expose()
  iconNightUrl: string

  @Expose()
  imageUrl: string

  @Expose()
  aqi: AirDailyForecastItem
}

export interface WeatherDailyForecastResponse {
  daily: WeatherDailyForecastItem[]
}

/**
 * @see https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
 */
@Exclude()
export class WeatherHourlyForecastItem {
  /** 预报时间 */
  fxTime: string

  /** 温度，默认单位：摄氏度 */
  @Expose()
  temp: string

  /** 天气状况和图标的代码 */
  @Expose()
  icon: string

  /** 天气状况的文字描述 */
  @Expose()
  text: string

  /** 风向360角度 */
  @Expose()
  wind360: string

  /** 风向 */
  @Expose()
  windDir: string

  /** 风力等级 */
  @Expose()
  windScale: string

  /** 风速，公里/小时 */
  @Expose()
  windSpeed: string

  /** 相对湿度，百分比数值 */
  @Expose()
  humidity: string

  /** 当前小时累计降水量，默认单位：毫米 */
  @Expose()
  precip: string

  /** 逐小时预报降水概率，百分比数值，可能为空 */
  @Expose()
  pop: string

  /** 大气压强，默认单位：百帕 */
  @Expose()
  pressure: string

  /** 云量，百分比数值 */
  @Expose()
  cloud: string

  /** 露点温度 */
  @Expose()
  dew: string

  // 人工处理的属性
  @Expose()
  iconUrl: string

  /** 预报时间 */
  @Expose()
  time: string
}

export interface WeatherHourlyForecastResponse {
  hourly: WeatherHourlyForecastItem[]
}

@Exclude()
export class LivingIndexItemItem {
  /** 预报日期 */
  @Expose()
  date: string

  /** 生活指数类型ID */
  @Expose()
  type: string

  /** 生活指数类型的名称 */
  @Expose()
  name: string

  /** 生活指数预报等级 */
  @Expose()
  level: string

  /** 生活指数预报级别名称 */
  @Expose()
  category: string

  /** 生活指数预报的详细描述，可能为空 */
  @Expose()
  text: string

  // 自定义部分
  @Expose()
  iconUrl: string
}

export interface LivingIndexItemResponse {
  daily: LivingIndexItemItem[]
}

@Exclude()
export class AirNow {
  /** 空气质量指数 */
  @Expose()
  aqi: string

  /** 空气质量指数等级 */
  @Expose()
  level: string

  /** 空气质量指数级别 */
  @Expose()
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
  @Expose()
  primary: string

  /** PM10 */
  @Expose()
  pm10: string

  /** PM2.5 */
  @Expose()
  pm2p5: string

  /** 二氧化氮 */
  @Expose()
  no2: string

  /** 二氧化硫 */
  @Expose()
  so2: string

  /** 一氧化碳 */
  @Expose()
  co: string

  /** 臭氧 */
  @Expose()
  o3: string
}

@Exclude()
export class GridWeatherMinutelyItem {
  /** 预报时间 */
  @Expose()
  fxTime: string

  /** 10分钟累计降水量，单位毫米 */
  @Expose()
  precip: string

  /** 降水类型 */
  @Expose()
  type: 'rain' | 'snow'

  // 自定义部分

  @Expose()
  time: string

  @Expose()
  height: string
}

@Exclude()
export class GridWeatherMinutelyResponse {
  /** 当前API的最近更新时间 */
  @Expose()
  updateTime: string

  /** 分钟降水描述 */
  @Expose()
  summary: string

  minutely: GridWeatherMinutelyItem[]

  @Expose()
  list: GridWeatherMinutelyItem[]
}
