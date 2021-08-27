/** 和风天气接口响应数据基本格式 */
export class HefengResponse {
  /** API状态码 */
  code: string

  /** 城市信息查询 */
  location: CityInfo[]

  /** 热门城市查询 */
  topCityList: CityInfo[]

  /** 实时天气数据，实时空气质量 */
  now: WeatherNow | AirNow

  /** 逐天天气预报，天气生活指数，空气质量预报 */
  daily: DailyForecastItem[] | LivingIndexItem[] | AirDailyForecastItem[]

  /** 逐小时天气预报 */
  hourly: HourlyForecastItem[]

  /** 分钟级降水 */
  minutely: MinutelyRainItem[]

  /** 天气预警城市列表 */
  warningLocList: WarningCity[]

  /** 天气灾害预警 */
  warning: WarningNowItem[]
}

/** 和风天气接口响应数据 - 城市信息查询 */

/**
 * 城市信息查询` 接口主要数据
 *
 * @see
 * [城市信息查询](https://dev.qweather.com/docs/api/geo/city-lookup/)
 */
export class CityInfo {
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
 * @see
 * [实时天气](https://dev.qweather.com/docs/api/weather/weather-now/)
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
 * @see
 * [逐天天气预报](https://dev.qweather.com/docs/api/weather/weather-daily-forecast/)
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
 * @see
 * [逐小时天气预报](https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/)
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

/**
 * 天气预警城市
 *
 * @see
 * [天气预警城市列表](https://dev.qweather.com/docs/api/warning/weather-warning-city-list/)
 */
export class WarningCity {
  /** 当前国家预警的LocationID */
  locationId: string
}

/**
 * 天气生活指数
 *
 * @see
 * [天气生活指数](https://dev.qweather.com/docs/api/indices/)
 */
export class LivingIndexItem {
  /** 预报日期 */
  date: string

  /** 生活指数类型ID */
  type: string

  /** 生活指数类型的名称 */
  name: string

  /** 生活指数预报等级 */
  level: string

  /** 生活指数预报级别名称 */
  category: string

  /** 生活指数预报的详细描述，可能为空 */
  text: string

  // 自定义部分
  iconUrl: string
}

/**
 * 实时空气质量
 *
 * @see
 * [实时空气质量](https://dev.qweather.com/docs/api/air/air-now/)
 */
export class AirNow {
  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
  primary: string

  /** PM10 */
  pm10: string

  /** PM2.5 */
  pm2p5: string

  /** 二氧化氮 */
  no2: string

  /** 二氧化硫 */
  so2: string

  /** 一氧化碳 */
  co: string

  /** 臭氧 */
  o3: string
}

/**
 * 空气质量预报
 *
 * @see
 * [空气质量预报](https://dev.qweather.com/docs/api/air/air-daily-forecast/)
 */
export class AirDailyForecastItem {
  /** 预报日期 */
  fxDate: string

  /** 空气质量指数 */
  aqi: string

  /** 空气质量指数等级 */
  level: string

  /** 空气质量指数级别 */
  category: string

  /** 空气质量的主要污染物，空气质量为优时，返回值为 `NA` */
  primary: string
}

/**
 * 分钟级降水
 *
 * @see
 * [分钟级降水](https://dev.qweather.com/docs/api/grid-weather/minutely/)
 */
export class MinutelyRainItem {
  /** 预报时间 */
  fxTime: string

  /** 10分钟累计降水量，单位毫米 */
  precip: string

  /** 降水类型 */
  type: 'rain' | 'snow'
}

/**
 * 天气灾害预警
 *
 * @see
 * [天气灾害预警](https://dev.qweather.com/docs/api/warning/weather-warning/)
 */
export class WarningNowItem {
  /** 本条预警的唯一标识，可判断本条预警是否已经存在 */
  id: string

  /** 预警发布单位，可能为空 */
  sender?: string

  /** 预警发布时间 */
  pubTime: string

  /** 预警信息标题 */
  title: string

  /** 预警开始时间，可能为空 */
  startTime?: string

  /** 预警结束时间，可能为空 */
  endTime?: string

  /**
   * 预警状态，可能为空
   *
   * ```markdown
   * 1. `active` - 预警中或首次预警
   * 2. `update` - 预警信息更新
   * 3. `cancel` - 取消预警
   * ```
   */
  status?: string

  /** 预警等级 */
  level: string

  /** 预警类型ID */
  type: string

  /** 预警类型名称 */
  typeName: string

  /** 预警详细文字描述 */
  text: string

  /** 与本条预警相关联的预警ID，当预警状态为cancel或update时返回。可能为空 */
  related?: string
}
