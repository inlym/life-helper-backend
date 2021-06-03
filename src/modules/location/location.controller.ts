import { Controller, Get, Query, Ip } from '@nestjs/common'
import { LocationService } from './location.service'

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('')
  async getLocationInfo(@Query('ip') ip: string, @Ip() clientIp: string) {
    if (ip) {
      return await this.locationService.getLocationByIp(ip)
    } else {
      return await this.locationService.getLocationByIp(clientIp)
    }
  }
}
