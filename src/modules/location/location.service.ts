import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { LbsqqService } from './lbsqq.service'
import { Connection } from 'typeorm'
import { BasicAddressInfo, LocationInfo } from './location.model'

@Injectable()
export class LocationService {
  constructor(private lbsqqService: LbsqqService, private connection: Connection) {}

  /**
   * 根据 IP 地址获取经纬度以及省市区信息
   * @param ip IP 地址
   */
  async getLocationByIp(ip: string): Promise<LocationInfo> {
    const result = await this.lbsqqService.ipLocation(ip)
    return plainToClass(LocationInfo, Object.assign({}, result.ad_info, { longitude: result.location.lng, latitude: result.location.lat }))
  }

  /**
   * 通过经纬度获取省市区信息
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getAddressInfoByCoord(longitude: number, latitude: number): Promise<BasicAddressInfo> {
    const result = await this.lbsqqService.geoLocationCoder(longitude, latitude)
    return plainToClass(BasicAddressInfo, result.ad_info)
  }

  /**
   * 通过经纬度获取一句话地址描述
   */
  async getRecommendAddress(longitude: number, latitude: number): Promise<string> {
    const result = await this.lbsqqService.geoLocationCoder(longitude, latitude)
    return result.formatted_addresses.recommend
  }
}
