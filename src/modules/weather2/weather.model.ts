import { DailyForecastItem, HourlyForecastItem, WeatherNow, LivingIndexItem, AirNow, AirDailyForecastItem, MinutelyRainItem } from './hefeng/hefeng-http.model'
import { Exclude } from 'class-transformer'

/**
 * 扩展的实时天气对象
 */
export class ExtWeatherNow extends WeatherNow {
  /** 观测时间距当前时间的分钟数 */
  obsDiff: number
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
export class ExtAirNow extends AirNow {}

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

export class ExtWarningNowItem extends ExtWarningNowItem {}

/** 合并的天气信息 */
export class CombinedWeather {
  now: ExtWeatherNow
  daily: ExtDailyForecastItem[]
  hourly: ExtHourlyForecastItem[]
  airnow: ExtAirNow
  air5d: ExtAirDailyForecastItem[]
  liveIndex: ExtLivingIndexItem[]
  warning: ExtWarningNowItem[]
  rain: ExtMinutelyRainItem[]
}
