import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'
import { HefengService } from './hefeng.service'
import { WeatherCityService } from './weather-city.service'
import { WeatherCity } from 'src/entities/weather-city.entity'
import { LocationModule } from '../location/location.module'

@Module({
  imports: [TypeOrmModule.forFeature([WeatherCity]), LocationModule],
  controllers: [WeatherController],
  providers: [WeatherService, HefengService, WeatherCityService],
  exports: [WeatherService, HefengService, WeatherCityService],
})
export class WeatherModule {}
