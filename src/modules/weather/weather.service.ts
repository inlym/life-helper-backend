import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengService } from './hefeng/hefeng.service'
import { WeatherCity } from './weather-city/weather-city.entity'
import { WeatherCityService } from './weather-city/weather-city.service'

@Injectable()
export class WeatherService {
  constructor(
    private readonly hefengService: HefengService,
    private readonly weatherCityService: WeatherCityService,
    private readonly lbsqqService: LbsqqService
  ) {}

  /**
   * 根据和风天气的图标数字，输出展示的天空元素
   *
   * @since 2021-03-17
   * @tag [和风天气]
   * @param {string} icon 和风天气的 icon id
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

  /**
   * 获取基础天气情况
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getBasicWeather(locationId: string) {
    const promises = []

    promises.push(this.hefengService.getWeatherNow(locationId))
    promises.push(this.hefengService.getWeatherDailyForecast(locationId, 'weather-15d'))
    promises.push(this.hefengService.getWeatherHourlyForecast(locationId, 'weather-24h'))
    promises.push(this.hefengService.getAirNow(locationId))
    promises.push(this.hefengService.getAirDailyForecast(locationId))
    promises.push(this.hefengService.getLivingIndex(locationId))

    const [now, f15d, f24h, airnow, air5d, livingIndex] = await Promise.all(promises)

    return { now, f15d, f24h, airnow, air5d, livingIndex }
  }

  /**
   * 用于未登录状态获取天气详情
   *
   * @param locationId 和风天气的 `LocationId`
   */
  async getWeatherForPublic(locationId: string) {
    const city = await this.hefengService.getCityInfo(locationId)
    const basicWeather = await this.getBasicWeather(locationId)

    const location = {
      id: city.id,
      position: `${city.name},${city.adm2},${city.adm1}`,
    }

    return { location, ...basicWeather }
  }

  /**
   * 通过 IP 地址查询天气（用于未登录状态）
   *
   * @param ip IP 地址
   */
  async getWeatherByIp(ip: string) {
    const { longitude, latitude } = await this.lbsqqService.getCoordinateByIp(ip)
    const locationId = await this.hefengService.getLocationId(longitude, latitude)
    return this.getWeatherForPublic(locationId)
  }

  /**
   * 用于已登录用户获取天气详情
   *
   * @param userId 用户 ID
   * @param cityId 城市 ID
   */
  async getPrivateWeather(userId: number, ip: string, cityId?: number) {
    let city: WeatherCity

    if (typeof cityId === 'number' && cityId > 0) {
      city = await this.weatherCityService.getByPk(userId, cityId)
    }

    const cities = await this.weatherCityService.getAll(userId, 5, 0)
    if (!city && cities.length > 0) {
      city = cities[0]
    }

    if (!city) {
      return this.getWeatherByIp(ip)
    }

    const { locationId, longitude, latitude } = city

    const rain = await this.hefengService.getGridWeatherMinutely(longitude, latitude)
    const basic = await this.getBasicWeather(locationId)

    return { cities, rain, ...basic }
  }
}
