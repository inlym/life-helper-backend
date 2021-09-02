import {
  ExtAirDailyForecastItem,
  ExtAirNow,
  ExtDailyForecastItem,
  ExtHourlyForecastItem,
  ExtLivingIndexItem,
  ExtRainSurvey,
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

  air5d: ExtAirDailyForecastItem[]

  livingIndex: ExtLivingIndexItem[]

  rain: ExtRainSurvey

  warning: ExtWarningNowItem[]

  skyClass: SkyClass
}
