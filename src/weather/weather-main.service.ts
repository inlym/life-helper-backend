import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengPublicService } from './hefeng/hefeng-public.service'
import { WeatherCity } from './weather-city/weather-city.entity'
import { WeatherCityService } from './weather-city/weather-city.service'
import { GetWeatherOptions, LocationCoordinate, MixedWeather } from './weather-main.model'

/**
 * ### 功能定位
 *
 * ```markdown
 * 1. 对接控制器，为控制器提供支持。
 * ```
 */
@Injectable()
export class WeatherMainService {
  constructor(
    private readonly lbsqqService: LbsqqService,
    private readonly hefengPublicService: HefengPublicService,
    private readonly weatherCityService: WeatherCityService
  ) {}

  /**
   * 分离经纬度坐标
   *
   * @param coord 以逗号分隔的经纬度坐标
   *
   * @description
   *
   * ### 说明
   *
   * ```markdown
   * 1. 将 `120.1234,30.111` 形式的字符串穿解析为 `{ longitude:120.1234, latitude:30.111 }` 形式的对象。
   * ```
   */
  private splitCoordinate(coord: string): LocationCoordinate | undefined {
    const [longitude, latitude] = coord.split(',').map((str: string) => Number(str))

    if (!isNaN(longitude) && !isNaN(latitude)) {
      return { longitude, latitude }
    }
  }

  /**
   * 根据经纬度获取混合天气数据
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getWeatherByLocation(longitude: number, latitude: number): Promise<MixedWeather> {
    const locationId = await this.hefengPublicService.getLocationIdByCoordinate(longitude, latitude)
    const locationName = await this.lbsqqService.getRecommendAddressDescrption(longitude, latitude)
    const weatherUnion = await this.hefengPublicService.getWeatherUnion(locationId, longitude, latitude)

    return { locationName, ...weatherUnion }
  }

  /**
   * 根据 IP 地址获取数据
   *
   * @param ip IP 地址
   */
  async getWeatherByIp(ip: string): Promise<MixedWeather> {
    const { longitude, latitude } = await this.lbsqqService.getCoordinateByIp(ip)
    const locationId = await this.hefengPublicService.getLocationIdByCoordinate(longitude, latitude)
    const { city, district } = await this.lbsqqService.getAddressInfo(longitude, latitude)
    const weatherUnion = await this.hefengPublicService.getWeatherUnion(locationId, longitude, latitude)

    const locationName = (city ? city : '') + (district ? district : '')

    return { locationName, ...weatherUnion }
  }

  /**
   * 用于获取天气详情
   */
  async getWeather(options: GetWeatherOptions): Promise<MixedWeather> {
    if (options.userId) {
      let weatherCity: WeatherCity

      if (options.cityId) {
        weatherCity = await this.weatherCityService.getByPk(options.userId, options.cityId)
      }

      const cities = await this.weatherCityService.getAll(options.userId, 5, 0)

      if (cities.length > 0) {
        if (!weatherCity) {
          weatherCity = cities[0]
        }

        const { locationId, longitude, latitude } = weatherCity
        const weatherUnion = await this.hefengPublicService.getWeatherUnion(locationId, longitude, latitude)

        return {
          locationName: weatherCity.name,
          cityId: weatherCity.id,
          cities,
          ...weatherUnion,
        }
      }
    }

    if (options.location) {
      const { longitude, latitude } = this.splitCoordinate(options.location)
      return this.getWeatherByLocation(longitude, latitude)
    }

    if (options.ip) {
      return this.getWeatherByIp(options.ip)
    }
  }
}
