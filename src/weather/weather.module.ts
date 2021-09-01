import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { HefengModule } from './hefeng/hefeng.module'
import { WeatherCityModule } from './weather-city/weather-city.module'
import { WeatherDataService } from './weather-data.service'
import { WeatherMainService } from './weather-main.service'
import { WeatherUtilService } from './weather-util.service'
import { WeatherController } from './weather.controller'
import { HefengEnhancedService } from './hefeng/hefeng-extend.service'

@Module({
  imports: [HefengModule, SharedModule, WeatherCityModule],
  providers: [WeatherDataService, WeatherUtilService, WeatherMainService, HefengEnhancedService],
  controllers: [WeatherController],
})
export class WeatherModule {}
