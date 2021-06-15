import { Controller, Get, Query, Ip } from '@nestjs/common'
import { LocationService } from './location.service'

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get('')
  async getLocationInfo(@Query('ip') ip: string, @Query('location') location: string, @Ip() clientIp: string) {
    if (ip) {
      return await this.locationService.getLocationByIp(ip)
    } else if (location) {
      const [longitude, latitude] = location.split(',').map((item) => Number(item))
      const result = await this.locationService.getAddressInfoByCoord(longitude, latitude)
      const address = await this.locationService.getRecommendAddress(longitude, latitude)
      return Object.assign({}, { address }, result)
    } else {
      return await this.locationService.getLocationByIp(clientIp)
    }
  }
}
