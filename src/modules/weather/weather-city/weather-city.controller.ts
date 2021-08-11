import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { WxChooseLocationResult } from './weather-city.dto'
import { WeatherCityService } from './weather-city.service'

@Controller('weather/city')
export class WeatherCityController {
  constructor(private readonly weatherCityService: WeatherCityService) {}

  /**
   * 新增一个天气城市
   */
  @Post()
  @UseGuards(AuthGuard)
  addCity(@User('id') userId: number, @Body() body: WxChooseLocationResult) {
    return this.weatherCityService.add(userId, body)
  }
}
