import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as dayjs from 'dayjs'
import { AliyunOssConfig } from 'life-helper-config'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengService } from './hefeng.service'
import { WeatherCityService } from './weather-city.service'
import {
  WeatherAir5dItem,
  WeatherAirNow,
  WeatherDailyForecastItem,
  WeatherHourlyForecastItem,
  WeatherLiveIndexItem,
  WeatherMinutely,
  WeatherNow,
  WeatherRainItem,
} from './weather.model'

@Injectable()
export class WeatherService {
  public iconPath = AliyunOssConfig.admin.url + '/static/hefeng/c1/'
  public imagePath = AliyunOssConfig.admin.url + '/static/hefeng/s2/'
  public weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  constructor(
    private readonly hefengService: HefengService,
    private readonly weatherCityService: WeatherCityService,
    private readonly lbsqqService: LbsqqService
  ) {}

  async getWeather(userId: number, ip: string, cityId?: number) {
    const cities = await this.weatherCityService.getAll(userId)

    if (cities.length === 0) {
      const { longitude, latitude } = await this.lbsqqService.getCoordinateByIp(ip)

      const locationId = await this.hefengService.getLocationId(longitude, latitude)
      const address = await this.lbsqqService.getRecommendAddressDescrption(longitude, latitude)
      const result = await this.getAdvancedWeather(locationId, longitude, latitude)
      return Object.assign({}, { cities, address }, result)
    } else {
      let city = cities[0]
      if (cityId) {
        const city2 = cities.find((item) => item.id === cityId)
        if (city2) {
          city = city2
        }
      }

      const { locationId, longitude, latitude, name: address } = city
      const result = await this.getAdvancedWeather(locationId, longitude, latitude)
      return Object.assign({}, { cities, address, activeCityId: city.id }, result)
    }
  }

  /**
   * 获取汇总的高级天气数据
   */
  async getAdvancedWeather(locationId: string, longitude: number, latitude: number) {
    const promises = []
    promises.push(this.getOrdinaryWeather(locationId))
    promises.push(this.getRain(longitude, latitude))

    const [ordinaryWeather, rain] = await Promise.all(promises)

    return { ...ordinaryWeather, rain }
  }

  /**
   * 获取汇总的通用天气数据
   */
  async getOrdinaryWeather(locationId: string) {
    const promises = []
    promises.push(this.getWeatherNow(locationId))
    promises.push(this.getWeather15d(locationId))
    promises.push(this.getWeather24h(locationId))
    promises.push(this.getAirNow(locationId))
    promises.push(this.getAir5d(locationId))
    promises.push(this.getLiveIndex(locationId))

    const [now, f15d, f24h, airnow, air5d, liveIndex] = await Promise.all(promises)
    const skyClass = this.skyClass(now.icon)

    return { now, f15d, f24h, airnow, air5d, liveIndex, skyClass }
  }

  /**
   * 获取当前实时天气
   * @update 2021-07-23
   */
  async getWeatherNow(locationId: string): Promise<WeatherNow> {
    const result = await this.hefengService.getData('weather-now', locationId)
    const now: Partial<WeatherNow> = result.now
    now.summary = `现在${now.text}，温度 ${now.temp} 度。当前湿度 ${now.humidity}%，${now.windDir}${now.windScale}级，风速 ${now.windSpeed}km/h`

    return plainToClass(WeatherNow, now)
  }

  /**
   * 获取未来 15 天天气预报（包含了未来 5 天空气质量预报）
   */
  async getWeather15d(locationId: string): Promise<WeatherDailyForecastItem[]> {
    const promises = [this.hefengService.getData('weather-15d', locationId), this.getAir5d(locationId)]
    const [w15Result, air5d] = await Promise.all(promises)

    return w15Result.daily.map((item: Partial<WeatherDailyForecastItem>) => {
      item.iconDayUrl = this.iconPath + item.iconDay + '.svg'
      item.iconNightUrl = this.iconPath + item.iconNight + '.svg'
      item.imageUrl = this.imagePath + item.iconDay + '.png'

      // 添加 `date` 属性，格式：`2021-06-23`
      item.date = item.fxDate

      const d = dayjs(item.fxDate)

      // 添加 `dayText` 属性，格式：`昨天`，`今天`,`明天`,`后天`,`周一`,`周二` ...
      if (dayjs().get('date') === d.get('date')) {
        item.dayText = '今天'
      } else if (dayjs().add(1, 'day').get('date') === d.get('date')) {
        item.dayText = '明天'
      } else if (dayjs().add(2, 'day').get('date') === d.get('date')) {
        item.dayText = '后天'
      } else if (dayjs().subtract(1, 'day').get('date') === d.get('date')) {
        item.dayText = '昨天'
      } else {
        item.dayText = this.weekText[d.get('day')]
      }

      // 添加 `text` 属性，格式：`多云转晴`，`多云`
      const { textDay, textNight } = item
      if (textDay === textNight) {
        item.text = textDay
      } else {
        item.text = textDay + '转' + textNight
      }

      // 添加 `dateText` 属性，格式：`6/19`
      item.dateText = `${d.get('month') + 1}/${d.get('date')}`

      // 绑定 `aqi` 属性
      item.aqi = air5d.find((e) => e.date === item.date)

      return plainToClass(WeatherDailyForecastItem, item)
    })
  }

  async getWeather24h(locationId: string): Promise<WeatherHourlyForecastItem[]> {
    const result = await this.hefengService.getData('weather-24h', locationId)
    return result.hourly.map((item) => {
      item.iconUrl = this.iconPath + item.icon + '.svg'
      return plainToClass(WeatherHourlyForecastItem, item)
    })
  }

  async getAirNow(locationId: string): Promise<WeatherAirNow> {
    const result = await this.hefengService.getData('air-now', locationId)
    return plainToClass(WeatherAirNow, result.now)
  }

  async getAir5d(locationId: string): Promise<WeatherAir5dItem[]> {
    const result = await this.hefengService.getData('air-5d', locationId)
    return result.daily.map((item) => {
      return plainToClass(WeatherAir5dItem, item)
    })
  }

  async getRain(longitude: number, latitude: number): Promise<WeatherMinutely> {
    const lng = longitude.toFixed(2)
    const lat = latitude.toFixed(2)
    const location = `${lng},${lat}`
    const result = await this.hefengService.getData('minutely-5m', location)
    const list = result.minutely.map((item) => {
      item.time = item.fxTime.substring(11, 16)
      item.height = (parseFloat(item.precip) * 200 + 10).toFixed(0)
      return plainToClass(WeatherRainItem, item)
    })
    const updateTime = result.updateTime.substring(11, 16)
    const output = {
      updateTime,
      summary: result.summary,
      list,
    }
    return plainToClass(WeatherMinutely, output)
  }

  async getLiveIndex(locationId: string): Promise<WeatherLiveIndexItem[]> {
    const result = await this.hefengService.getData('indices-1d', locationId)
    const iconUrlPrefix = 'https://img.lh.inlym.com/static/hefeng/live/'
    return result.daily.map((item) => {
      item.iconUrl = iconUrlPrefix + item.type + '.svg'
      return plainToClass(WeatherLiveIndexItem, item)
    })
  }

  /**
   * 根据和风天气的图标数字，输出展示的天空元素
   * @since 2021-03-17
   * @tag [和风天气]
   * @param {string} icon 和风天气的icon id
   *
   * 背景类：
   * - 普通 wbg-common
   * - 夜晚 wbg-night
   * - 小中雨 wbg-lightrain
   * - 灰暗 wbg-grey
   *
   * 天空元素类：
   * - 满月 fullmoon
   * - 半月 halfmoon
   * - 太阳 sun
   * - 固定云 fixed-cloud
   * - 浮动云 moving-cloud
   * - 乌云 darkcloud
   * - 雨点 rain
   *
   * 1-晴、2-云、3-阴、4-雨、5-雪、6-雾、7-尘
   */
  skyClass(icon: string) {
    const iconId = parseInt(icon, 10)

    /** 最终输出的内容 */
    const result = {
      bgClass: 'wbg-grey',
      sun: true,
      fixedCloud: true,
      movingCloud: true,
      darkCloud: true,
      fullmoon: false,
    }

    if ([100, 103, 150, 153].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.fixedCloud = false
      result.movingCloud = false
      result.darkCloud = false
    } else if ([101, 102].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.movingCloud = false
      result.darkCloud = false
    } else if ([104, 154].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.darkCloud = false
    } else if (iconId >= 300 && iconId < 400) {
      result.bgClass = 'wbg-lightrain'
    }

    /** 当前时间的 小时 */
    const hour = new Date().getHours()

    if (hour <= 6 || hour >= 18) {
      result.sun = false
      result.fullmoon = true
      result.bgClass = 'wbg-night'
    }
    return result
  }
}
