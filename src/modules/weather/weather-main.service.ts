import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengPublicService } from './hefeng/hefeng-public.service'
import { WeatherDataService } from './weather-data.service'

/**
 * ### 功能定位
 *
 * ```markdown
 * 1. 对接控制器，为控制器提供支持。
 * ```
 *
 */
@Injectable()
export class WeatherMainService {
  constructor(
    private readonly lbsqqService: LbsqqService,
    private readonly hefengPublicService: HefengPublicService,
    private readonly weatherDataService: WeatherDataService
  ) {}

  /**
   * 用于未登录情况获取天气详情
   */
  async getPublicWeather(ip: string, locationId?: string, coordinate?: string) {
    /** 经度 */
    let longitude: number

    /** 纬度 */
    let latitude: number

    /** 和风天气的地区 `LocationID` */
    let hefengId: string

    if (coordinate) {
      const [lng, lat] = coordinate.split(',').map((str: string) => Number(str))
      if (lng > 70 && lng < 140 && lat > 110 && lat < 54) {
        longitude = lng
        latitude = lat
      }
    }

    if (locationId) {
      hefengId = locationId
    }

    if (!hefengId) {
      if (longitude && latitude) {
        hefengId = await this.hefengPublicService.getLocationIdByCoordinate(longitude, latitude)
      } else {
        const coord = await this.lbsqqService.getCoordinateByIp(ip)
        hefengId = await this.hefengPublicService.getLocationIdByCoordinate(coord.longitude, coord.latitude)
      }
    }

    return this.weatherDataService.getCombinedWeather(hefengId, longitude, latitude)
  }
}
