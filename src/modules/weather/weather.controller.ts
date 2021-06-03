import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common'
import { User } from 'src/common/decorators/user.decorator'
import { WeatherCityService } from './weather-city.service'
import { WxChooseLocationResult } from './weather.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'

@Controller('weather')
export class WeatherController {
  constructor(private weatherCityService: WeatherCityService) {}

  @Get('cities')
  @UseGuards(AuthGuard)
  getAllCities(@User('id') userId: number) {
    return this.weatherCityService.getAll(userId)
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
