import { Controller, Get, Ip, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengService } from './hefeng/hefeng.service'
import { WeatherCityService } from './weather-city/weather-city.service'
import { GetPrivateWeatherQueryDto, GetPublicWeatherQueryDto } from './weather.dto'
import { WeatherService } from './weather.service'

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private weatherCityService: WeatherCityService,
    private weatherService: WeatherService,
    private hefengService: HefengService,
    private readonly lbsqqService: LbsqqService
  ) {}

  /**
   * 用于已登录状态获取天气详情
   */
  @Get('')
  @UseGuards(AuthGuard)
  async getPrivateWeather(@User('id') userId: number, @Ip() ip: string, @Query() query: GetPrivateWeatherQueryDto) {
    const cityId = query.city_id
    return this.weatherService.getPrivateWeather(userId, ip, cityId)
  }

  /**
   * 用于未登录状态获取天气详情
   */
  @Get('public')
  async getPublicWeather(@Ip() ip: string, @Query() query: GetPublicWeatherQueryDto) {
    const locationId = query.location_id
    const location = query.location

    if (locationId) {
      return this.weatherService.getWeatherForPublic(locationId)
    } else if (location) {
      const [longitude, latitude] = location.split(',').map((str: string) => Number(str))
      const locationId2 = await this.hefengService.getLocationId(longitude, latitude)
      return this.weatherService.getWeatherForPublic(locationId2)
    }
    return this.weatherService.getWeatherByIp(ip)
  }
}
