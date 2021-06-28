import { Body, Controller, Delete, Get, Ip, Post, Query, UseGuards } from '@nestjs/common'
import { User } from 'src/common/user.decorator'
import { WeatherCityService } from './weather-city.service'
import { WeatherService } from './weather.service'
import { HefengService } from './hefeng.service'
import { LocationService } from '../location/location.service'
import { WxChooseLocationResult, Weather15dRes } from './weather.dto'
import { AuthGuard } from 'src/common/auth.guard'
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

  /**
   * 获取未来 15 天天气预报
   *
   * 说明：
   * 1. 为保证接口通用性，同时支持使用 `LocationId` 和经纬度请求，两者都无时，则使用客户端 IP 地址，最终结果是转化为 `LocationId`
   *
   * @param id 和风天气中的 `LocationId`
   * @param location `120.111,30.222` 格式的经纬度坐标 组合
   * @param ip 客户端 IP 地址
   */
  @Get('15d')
  async getWeather15d(@Query('id') id: string, @Query('location') location: string, @Ip() ip: string): Promise<Weather15dRes> {
    let locationId: string

    if (id) {
      locationId = id
    } else if (location) {
      console.log('location: ', location)
      const [longitude, latitude] = location.split(',').map((item) => Number(item))
      locationId = await this.hefengService.getLocationId(longitude, latitude)
    } else {
      const { longitude, latitude } = await this.locationService.getLocationByIp(ip)
      locationId = await this.hefengService.getLocationId(longitude, latitude)
    }

    const f15d = await this.weatherService.getWeather15d(locationId)
    return { list: f15d }
  }
}
