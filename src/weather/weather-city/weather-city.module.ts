import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { HefengModule } from '../hefeng/hefeng.module'
import { WeatherCityController } from './weather-city.controller'
import { WeatherCity } from './weather-city.entity'
import { WeatherCityService } from './weather-city.service'

@Module({
  imports: [TypeOrmModule.forFeature([WeatherCity]), SharedModule, HefengModule],
  providers: [WeatherCityService],
  controllers: [WeatherCityController],
  exports: [WeatherCityService],
})
export class WeatherCityModule {}
