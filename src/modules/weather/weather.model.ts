import { Exclude, Expose, Transform, Type } from 'class-transformer'

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

  @Expose()
  summary: string

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
  // 以下为原始数据（未做处理）

  /** 预报日期 */
  @Expose()
  date: string

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

  // 额外绑定的 `air5d` 当天数据
  @Expose()
  @Type(() => WeatherAir5dItem)
  aqi: WeatherAir5dItem
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
