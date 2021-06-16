import { Body, Controller, Delete, Get, Ip, Post, Query, UseGuards } from '@nestjs/common'
import { User } from 'src/common/decorators/user.decorator'
import { WeatherCityService } from './weather-city.service'
import { WeatherService } from './weather.service'
import { HefengService } from './hefeng.service'
import { LocationService } from '../location/location.service'
import { WxChooseLocationResult, Weather15dRes } from './weather.dto'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private weatherCityService: WeatherCityService,
    private weatherService: WeatherService,
    private hefengService: HefengService,
    private locationService: LocationService
  ) {}

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

  @Get('15d')
  async getWeather15d(@Query('id') id: string, @Query('location') location: string, @Ip() ip: string): Promise<Weather15dRes> {
    let list = []

    if (id) {
      list = await this.weatherService.getWeather15d(id)
    } else if (location) {
      const [longitude, latitude] = location.split(',').map((item) => Number(item))
      const locationId = await this.hefengService.getLocationId(longitude, latitude)
      list = await this.weatherService.getWeather15d(locationId)
    } else {
      const { longitude, latitude } = await this.locationService.getLocationByIp(ip)
      const locationId = await this.hefengService.getLocationId(longitude, latitude)
      list = await this.weatherService.getWeather15d(locationId)
    }

    return { list }
  }
}
