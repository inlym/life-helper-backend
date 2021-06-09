import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as dayjs from 'dayjs'
import { HefengService } from './hefeng.service'
import { WeatherCityService } from './weather-city.service'
import { LocationService } from '../location/location.service'
import {
  WeatherNow,
  WeatherHourlyForecastItem,
  WeatherDailyForecastItem,
  WeatherRainItem,
  WeatherMinutely,
  WeatherLiveIndexItem,
  WeatherAirNow,
  WeatherAir5dItem,
} from './weather.class'

@Injectable()
export class WeatherService {
  public iconPath = 'https://img.lh.inlym.com/hefeng/c1/'
  public weekText = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  constructor(private hefengService: HefengService, private weatherCityService: WeatherCityService, private locationService: LocationService) {}

  async getWeather(userId: number, ip: string, cityId?: number) {
    const cities = await this.weatherCityService.getAll(userId)

    if (cities.length === 0) {
      const { longitude, latitude } = await this.locationService.getLocationByIp(ip)
      const locationId = await this.hefengService.getLocationId(longitude, latitude)
      const result = await this.mergeWeatherInfo(locationId, longitude, latitude)
      return Object.assign({}, { cities }, result)
    } else {
      let city = cities[0]
      if (cityId) {
        const city2 = cities.find((item) => item.id === cityId)
        if (city2) {
          city = city2
        }
      }
      const { locationId, longitude, latitude } = city
      const result = await this.mergeWeatherInfo(locationId, longitude, latitude)
      return Object.assign({}, { cities }, result)
    }
  }

  async mergeWeatherInfo(locationId: string, longitude: number, latitude: number) {
    const promises = []
    promises.push(this.getWeatherNow(locationId))
    promises.push(this.getWeather15d(locationId))
    promises.push(this.getWeather24h(locationId))
    promises.push(this.getAirNow(locationId))
    promises.push(this.getAir5d(locationId))
    promises.push(this.getRain(longitude, latitude))
    promises.push(this.getLiveIndex(locationId))

    const [now, f15d, f24h, airnow, air5d, rain, liveIndex] = await Promise.all(promises)
    const skyClass = this.skyClass(now.icon)
    return { now, f15d, f24h, airnow, air5d, rain, liveIndex, skyClass }
  }

  async getWeatherNow(locationId: string): Promise<WeatherNow> {
    const result = await this.hefengService.getData('weather-now', locationId)
    return plainToClass(WeatherNow, result.now)
  }

  async getWeather15d(locationId: string): Promise<WeatherDailyForecastItem[]> {
    const result = await this.hefengService.getData('weather-15d', locationId)

    return result.daily.map((item) => {
      item.iconDayUrl = this.iconPath + item.iconDay + '.svg'
      item.iconNightUrl = this.iconPath + item.iconNight + '.svg'

      const d = dayjs(item.fxDate)

      // 处理 `dayText`
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

      // 处理 `dateText`
      item.dateText = `${d.get('month') + 1}/${d.get('date')}`

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
    const iconUrlPrefix = 'https://img.lh.inlym.com/hefeng/life/'
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
