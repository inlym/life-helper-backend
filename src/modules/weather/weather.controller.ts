import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WeatherMainService } from './weather-main.service'
import { GetPublicWeatherQueryDto } from './weather.dto'

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherMainService: WeatherMainService) {}

  /**
   * 用于未登录状态获取天气详情
   */
  @Get(['public', 'common'])
  getPublicWeather(@Ip() ip: string, @Query() query: GetPublicWeatherQueryDto) {
    const locationId = query.location_id
    const coordinate = query.location

    return this.weatherMainService.getPublicWeather(ip, locationId, coordinate)
  }
}
