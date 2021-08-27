import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { HefengApiService } from '../weather2/hefeng/hefeng-api.service'
import { HefengService } from '../weather2/hefeng/hefeng.service'
import { WeatherCityController } from './weather-city/weather-city.controller'
import { WeatherCity } from './weather-city/weather-city.entity'
import { WeatherCityService } from './weather-city/weather-city.service'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'
import { HefengModule } from '../weather2/hefeng/hefeng.module'

@Module({
  imports: [TypeOrmModule.forFeature([WeatherCity]), SharedModule, HefengModule],
  controllers: [WeatherController, WeatherCityController],
  providers: [WeatherService, HefengService, WeatherCityService, HefengApiService],
  exports: [WeatherService, HefengService, WeatherCityService],
})
export class WeatherModule {}
