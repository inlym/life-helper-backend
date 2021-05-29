import { Injectable } from '@nestjs/common'
import { LbsqqService } from './lbsqq.service'
import { LocationInfo, IpLocationResult } from './location.interface'

@Injectable()
export class LocationService {
  constructor(private lbsqqService: LbsqqService) {}

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
}
