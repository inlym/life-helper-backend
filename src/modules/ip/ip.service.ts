import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'

@Injectable()
export class IpService {
  constructor(private readonly lbsqqService: LbsqqService) {}

  /**
   * 获取关于该 IP 地址的相关信息（目前仅 IP 定位信息）
   *
   * @param ip IP 地址
   */
  async queryIp(ip: string) {
    const result = await this.lbsqqService.locateIp(ip)
    return result.result
  }
}
