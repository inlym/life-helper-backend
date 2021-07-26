import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { HefengService } from './hefeng.service'
import { WeatherCityRepository } from './weather-city.repository'
import { WeatherCityService } from './weather-city.service'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'

@Module({
  imports: [TypeOrmModule.forFeature([WeatherCityRepository]), SharedModule],
  controllers: [WeatherController],
  providers: [WeatherService, HefengService, WeatherCityService],
  exports: [WeatherService, HefengService, WeatherCityService],
})
export class WeatherModule {}
