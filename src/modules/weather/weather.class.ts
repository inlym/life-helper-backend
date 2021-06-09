import { Exclude, Expose, Transform } from 'class-transformer'

@Exclude()
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
@Exclude()
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

@Exclude()
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

@Exclude()
export class WeatherRainItem {
  @Expose()
  time: string

  @Expose()
  precip: string

  @Expose()
  height: string
}

@Exclude()
export class WeatherMinutely {
  @Expose()
  updateTime: string

  @Expose()
  summary: string

  @Expose()
  list: WeatherRainItem[]
}

@Exclude()
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

@Exclude()
export class WeatherAirNow {
  @Expose()
  aqi: string

  @Expose()
  level: string

  @Expose()
  category: string

  @Expose()
  primary: string

  @Expose()
  pm10: string

  @Expose()
  pm2p5: string

  @Expose()
  no2: string

  @Expose()
  so2: string

  @Expose()
  co: string

  @Expose()
  o3: string
}

@Exclude()
export class WeatherAir5dItem {
  @Expose({ name: 'fxDate' })
  date: string

  @Expose()
  aqi: string

  @Expose()
  level: string

  @Expose()
  category: string

  @Expose()
  primary: string
}
