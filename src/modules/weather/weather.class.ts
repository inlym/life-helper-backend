import { Expose, Transform } from 'class-transformer'

/**
 * 实时天气方法返回内容
 * Weather#getWeatherNow
 */
export class WeatherNow {
  obsTime: string

  @Expose()
  temp: string

  @Expose()
  icon: string

  @Expose()
  text: string

  @Expose()
  wind360: string

  @Expose()
  windDir: string

  @Expose()
  windScale: string

  @Expose()
  windSpeed: string

  @Expose()
  humidity: string

  @Expose()
  precip: string

  @Expose()
  pressure: string

  @Expose()
  vis: string

  cloud: string
  dew: string
}

/**
 * @see https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
 */
export class WeatherHourlyForecastItem {
  @Expose({ name: 'fxTime' })
  @Transform((item) => {
    return item.value.substring(11, 16)
  })
  time: string

  @Expose()
  temp: string

  @Expose()
  icon: string

  @Expose()
  text: string

  // 人工处理的属性
  @Expose()
  iconUrl: string
}

export class WeatherDailyForecastItem {
  @Expose({ name: 'fxDate' })
  date: string

  @Expose()
  dayText: string

  @Expose()
  dateText: string

  @Expose()
  tempMax: string

  @Expose()
  tempMin: string

  @Expose()
  textDay: string

  @Expose()
  textNight: string

  @Expose()
  iconDayUrl: string

  @Expose()
  iconNightUrl: string
}

export class WeatherRainItem {
  @Expose()
  time: string

  @Expose()
  precip: string

  @Expose()
  height: string
}

export class WeatherMinutely {
  @Expose()
  updateTime: string

  @Expose()
  summary: string

  @Expose()
  list: WeatherRainItem[]
}

export class WeatherLiveIndexItem {
  @Expose()
  iconUrl: string

  @Expose()
  date: string

  @Expose()
  type: string

  @Expose()
  name: string

  @Expose()
  level: string

  @Expose()
  category: string

  @Expose()
  text: string
}
