import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User } from 'src/common/user.decorator'
import { WeatherMainService } from './weather-main.service'
import { GetWeatherQueryDto } from './weather.dto'
import { MixedWeather } from './weather.model'

@ApiTags('weather')
@Controller(['weather', 'w'])
export class WeatherController {
  constructor(private readonly weatherMainService: WeatherMainService) {}

  /**
   * 用于未登录状态获取天气详情
   */
  @Get(['public', 'common', ''])
  getWeather(@Ip() ip: string, @User('id') userId: number, @Query() query: GetWeatherQueryDto): Promise<MixedWeather> {
    const location = query.location
    const cityId = query.city_id

    return this.weatherMainService.getWeather({ ip, userId, location, cityId })
  }
}
