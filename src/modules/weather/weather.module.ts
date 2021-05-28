import { Module } from '@nestjs/common'
import { WeatherController } from './weather.controller'
import { WeatherService } from './weather.service'

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
