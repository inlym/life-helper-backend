import {
  ExtAirDailyForecastItem,
  ExtAirNow,
  ExtDailyForecastItem,
  ExtHourlyForecastItem,
  ExtLivingIndexItem,
  ExtMinutelyRainItem,
  ExtWarningNowItem,
  ExtWeatherNow,
  SkyClass,
} from './hefeng-extend.model'

/**
 * 联合天气数据
 */
export class WeatherUnion {
  now: ExtWeatherNow

  f15d: ExtDailyForecastItem[]

  f24h: ExtHourlyForecastItem[]

  airnow: ExtAirNow

  f5d: ExtAirDailyForecastItem[]

  livingIndex: ExtLivingIndexItem[]

  rain: ExtMinutelyRainItem[]

  warningNow: ExtWarningNowItem[]

  skyClass: SkyClass
}
