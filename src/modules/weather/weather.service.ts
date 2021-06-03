import { Injectable } from '@nestjs/common'
import { HefengService } from './hefeng.service'

@Injectable()
export class WeatherService {
  constructor(private hefengService: HefengService) {}
}
