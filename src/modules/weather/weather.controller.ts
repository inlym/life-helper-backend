import { Body, Controller, Delete, Get, Ip, Post, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengService } from './hefeng/hefeng.service'
import { WeatherCityService } from './weather-city/weather-city.service'
import { GetPrivateWeatherQueryDto, WxChooseLocationResult } from './weather.dto'
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
  async getPublicWeather(@Ip() ip: string, @Query('location_id') locationId: string) {
    if (locationId) {
      return this.weatherService.getWeatherForPublic(locationId)
    }
    return this.weatherService.getWeatherByIp(ip)
  }

  @Get('cities')
  @UseGuards(AuthGuard)
  async getAllCities(@User('id') userId: number) {
    const result = await this.weatherCityService.getAll(userId)
    console.log('result: ', result)
    return result
  }

  @Post('city')
  @UseGuards(AuthGuard)
  addCity(@User('id') userId: number, @Body() body: WxChooseLocationResult) {
    return this.weatherCityService.add(userId, body)
  }

  @Delete('city')
  @UseGuards(AuthGuard)
  removeCity(@User('id') userId: number, @Query('id') id: number) {
    return this.weatherCityService.remove(userId, id)
  }
}
