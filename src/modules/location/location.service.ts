import { Injectable } from '@nestjs/common'
import { LbsqqService } from './lbsqq.service'
import { Connection } from 'typeorm'
import { Location } from 'src/entities/location.entity'
import { LocationInfo, IpLocationResult } from './location.interface'
import { WxChooseLocationResult } from './location.dto'

@Injectable()
export class LocationService {
  constructor(private readonly lbsqqService: LbsqqService, private readonly connection: Connection) {}

  /**
   * 根据 IP 地址获取经纬度以及省市区信息
   * @param ip IP 地址
   */
  async getLocationByIp(ip: string): Promise<LocationInfo> {
    const result: IpLocationResult = await this.lbsqqService.ipLocation(ip)

    return {
      longitude: result.location.lng,
      latitude: result.location.lat,
      nation: result.ad_info.nation,
      province: result.ad_info.province,
      city: result.ad_info.city,
      district: result.ad_info.district,
      adcode: result.ad_info.adcode,
    }
  }

  /**
   * 添加一条定位记录
   */
  async addChooseLocationRecord(userId: number, type: number, options: WxChooseLocationResult) {
    const { name, address, longitude, latitude } = options
    const result = await this.lbsqqService.geoLocationCoder(longitude, latitude)
    const { adcode, nation, province, city, district } = result.ad_info
    const locationRepository = this.connection.getRepository(Location)
    return locationRepository.save({ userId, type, name, address, longitude, latitude, adcode, nation, province, city, district })
  }

  /**
   * 获取天气类定位记录列表
   */
  async getWeatherChooseLocationRecords(userId: number, type: number) {
    const locationRepository = this.connection.getRepository(Location)
    return locationRepository.find({ userId, type })
  }
}
