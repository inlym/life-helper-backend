import {
  DailyForecastItem,
  HourlyForecastItem,
  WeatherNow,
  LivingIndexItem,
  AirNow,
  AirDailyForecastItem,
  MinutelyRainItem,
  WarningNowItem,
} from './hefeng/hefeng-http.model'
import { Exclude } from 'class-transformer'
import { WeatherCity } from './weather-city/weather-city.entity'

/**
 * 扩展的实时天气对象
 */
export class ExtWeatherNow extends WeatherNow {
  /** 观测时间距当前时间的分钟数 */
  obsDiff?: number
}

/**
 * 扩展的逐天预报详情
 */
export class ExtDailyForecastItem extends DailyForecastItem {
  /** 预报日期 */
  @Exclude() fxDate: string

  /** 预报日期 */
  date: string

  /** 昨天、今天、明天、周一、周二等格式文本 */
  dayText: string

  /** `6/15` 格式的月和日文本 */
  dateText: string

  /** `晴转多云` 格式的文字 */
  text: string

  /** 图标（白天） */
  iconDayUrl: string

  /** 图标（晚上） */
  iconNightUrl: string

  /** 天气图片 */
  imageUrl: string
}

/**
 * 扩展的逐小时天气预报详情
 */
export class ExtHourlyForecastItem extends HourlyForecastItem {
  /** 预报时间 */
  @Exclude() fxTime: string

  /** 预报时间，格式：`06:00` */
  time: string

  /** 图标地址 */
  iconUrl: string
}

/**
 * 扩展的天气生活指数
 */
export class ExtLivingIndexItem extends LivingIndexItem {
  /** 图标地址 */
  iconUrl: string
}

/**
 * 扩展的实时空气质量
 */
export class ExtAirNow extends AirNow {
  q
}

export class ExtAirDailyForecastItem extends AirDailyForecastItem {
  /** 预报日期 */
  @Exclude() fxDate: string

  /** 预报日期 */
  date: string
}

export class ExtMinutelyRainItem extends MinutelyRainItem {
  /** 预报时间 */
  time: string

  /** 用于 CSS 样式的高度 */
  height: string
}

export class ExtWarningNowItem extends WarningNowItem {}

/** 合并的天气信息 */
export class CombinedWeather {
  now: ExtWeatherNow
  f15d: ExtDailyForecastItem[]
  f24h: ExtHourlyForecastItem[]
  airnow: ExtAirNow
  air5d: ExtAirDailyForecastItem[]
  livingIndex: ExtLivingIndexItem[]
  warning: ExtWarningNowItem[]
  rain: ExtMinutelyRainItem[]
}

/** 包含地理位置的天气信息 */
export class MixedWeather extends CombinedWeather {
  /** 地理位置名称 */
  locationName?: string

  /** 当前使用的天气城市 ID */
  cityId?: number

  cities?: WeatherCity[]
}

/** 经纬度坐标 */
export interface LocationCoordinate {
  /** 经度 */
  longitude: number

  /** 纬度 */
  latitude: number
}

/** 获取天气数据选项 */
export interface GetWeatherOptions {
  /** 用户 ID */
  userId?: number

  /** 和风天气的 `LocationID` */
  locationId?: string

  /** IP 地址 */
  ip: string

  /** 天气城市 ID */
  cityId?: number

  /** 以逗号分隔的经纬度坐标 */
  location?: string
}
