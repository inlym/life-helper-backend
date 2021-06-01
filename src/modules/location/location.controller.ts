import { Controller, Get, Post, Query, Body, Ip, UseGuards } from '@nestjs/common'
import { LocationService } from './location.service'
import { User } from 'src/common/decorators/user.decorator'
import { WxChooseLocationResult } from './location.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'

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

  @UseGuards(AuthGuard)
  @Post('weather')
  async addChosenLocation4Weather(@Body() body: WxChooseLocationResult, @User('id') userId: number) {
    console.log('userId: ', userId)
    console.log('body: ', body)
    return this.locationService.addChooseLocationRecord(userId, 1, body)
  }
}
