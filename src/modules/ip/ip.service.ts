import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'

@Injectable()
export class IpService {
  constructor(private readonly lbsqqService: LbsqqService) {}

  /**
   * 获取关于该 IP 地址的相关信息
   *
   * @param ip IP 地址
   */
  async queryIp(ip: string) {
    const { longitude, latitude } = await this.lbsqqService.getCoordinateByIp(ip)
    const address = await this.lbsqqService.getAddressInfo(longitude, latitude)
    const mapUrl = await this.lbsqqService.getStaticMapUrl(longitude, latitude)

    return { ip, address, mapUrl, location: { longitude, latitude } }
  }
}
