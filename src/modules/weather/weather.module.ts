import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { HefengApiService } from './hefeng/hefeng-api.service'
import { HefengService } from './hefeng/hefeng.service'
import { WeatherCity } from './weather-city/weather-city.entity'
import { WeatherCityService } from './weather-city/weather-city.service'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'

@Module({
  imports: [TypeOrmModule.forFeature([WeatherCity]), SharedModule],
  controllers: [WeatherController],
  providers: [WeatherService, HefengService, WeatherCityService, HefengApiService],
  exports: [WeatherService, HefengService, WeatherCityService],
})
export class WeatherModule {}
