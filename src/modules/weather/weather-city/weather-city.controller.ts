import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'
import { User } from 'src/common/user.decorator'
import { AddResponseDto, WxChooseLocationResult } from './weather-city.dto'
import { WeatherCityService } from './weather-city.service'

@ApiTags('weather-city')
@Controller('weather/city')
export class WeatherCityController {
  constructor(private readonly weatherCityService: WeatherCityService) {}

  /**
   * 新增一个天气城市
   *
   * @param userId 用户 ID
   * @param body 请求数据
   */
  @Post()
  async add(@User('id') userId: number, @Body() body: WxChooseLocationResult): Promise<AddResponseDto> {
    const weatherCity = await this.weatherCityService.add(userId, body)
    return plainToClass(AddResponseDto, weatherCity)
  }
}
