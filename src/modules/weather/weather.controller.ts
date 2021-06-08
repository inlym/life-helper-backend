import { Body, Controller, Delete, Get, Ip, Post, Query, UseGuards } from '@nestjs/common'
import { User } from 'src/common/decorators/user.decorator'
import { WeatherCityService } from './weather-city.service'
import { WeatherService } from './weather.service'
import { WxChooseLocationResult } from './weather.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'

@Controller('weather')
export class WeatherController {
  constructor(private weatherCityService: WeatherCityService, private weatherService: WeatherService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getWeather(@User('id') userId: number, @Ip() ip: string, @Query('id') cityId: number) {
    return await this.weatherService.getWeather(userId, ip, cityId)
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
