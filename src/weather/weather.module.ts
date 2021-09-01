import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { HefengModule } from './hefeng/hefeng.module'
import { WeatherCityModule } from './weather-city/weather-city.module'
import { WeatherMainService } from './weather-main.service'
import { WeatherController } from './weather.controller'

@Module({
  imports: [HefengModule, SharedModule, WeatherCityModule],
  providers: [WeatherMainService],
  controllers: [WeatherController],
})
export class WeatherModule {}
