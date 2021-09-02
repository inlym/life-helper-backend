import { Exclude } from 'class-transformer'
import {
  AirDailyForecastItem,
  AirNow,
  DailyForecastItem,
  HourlyForecastItem,
  LivingIndexItem,
  MinutelyRainItem,
  WarningCity,
  WarningNowItem,
  WeatherNow,
} from './hefeng-http.model'

/**
 * 扩展的实时天气对象
 */
export class ExtWeatherNow extends WeatherNow {
  /** 观测时间 */
  @Exclude()
  obsTime: string

  /** 观测时间距当前时间的分钟数 */
  obsDiff?: number
}

/**
 * 扩展的逐天预报详情
 */
export class ExtDailyForecastItem extends DailyForecastItem {
  /** 预报日期 */
  @Exclude()
  fxDate: string

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
  @Exclude()
  fxTime: string

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
  /** 空气质量数据发布时间 */
  @Exclude()
  pubTime: string
}

export class ExtAirDailyForecastItem extends AirDailyForecastItem {
  /** 预报日期 */
  @Exclude()
  fxDate: string

  /** 预报日期 */
  date: string
}

/**
 * 扩展的分钟级降水预报列表项
 */
export class ExtMinutelyRainItem extends MinutelyRainItem {
  /** 预报时间 */
  @Exclude()
  fxTime: string

  /** 预报时间 */
  time: string

  /** 用于 CSS 样式的高度 */
  height: string
}

/**
 * 扩展的分钟级降水预报
 *
 * @description
 *
 * ### 说明
 *
 * ```markdown
 * 1. 由于处理逻辑的不同，缓存时带入了其他参数，需清除。
 * ```
 */
export class ExtRainSurvey {
  /** n 分钟前更新 */
  updateTimeDiff: number

  /** 降水描述 */
  summary: string

  list: ExtMinutelyRainItem[]
}

/**
 * 扩展的天气预警城市
 */
export class ExtWarningCity extends WarningCity {}

/**
 * 扩展的天气灾害预警
 */
export class ExtWarningNowItem extends WarningNowItem {}

export class SkyClass {
  bgClass: string
  sun: boolean
  fixedCloud: boolean
  movingCloud: boolean
  darkCloud: boolean
  fullmoon: boolean
}
