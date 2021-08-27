import { Module } from '@nestjs/common'
import { HefengModule } from './hefeng/hefeng.module'
import { WeatherDataService } from './weather-data.service'
import { WeatherUtilService } from './weather-util.service'

@Module({
  imports: [HefengModule],
  providers: [WeatherDataService, WeatherUtilService],
})
export class Weather2Module {}
