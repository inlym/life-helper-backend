import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { HefengService } from './hefeng.service'
import { LocationService } from '../location/location.service'
import { WxChooseLocationResult } from './weather.dto'
import { WeatherCityRepository } from './weather-city.repository'
import { WeatherCity } from './weather-city.entity'

@Injectable()
export class WeatherCityService {
  constructor(
    private readonly hefengService: HefengService,
    private readonly locationService: LocationService,
    private readonly weatherCityRepository: WeatherCityRepository
  ) {}

  async getAll(userId: number, limit = 5, offset = 0): Promise<WeatherCity[]> {
    return await this.weatherCityRepository.find({
      select: ['id', 'locationId', 'name', 'city', 'district', 'longitude', 'latitude'],
      where: { userId },
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
    })
  }

  async remove(userId: number, id: number) {
    return await this.weatherCityRepository.softDelete({ id, userId })
  }

  async add(userId: number, data: WxChooseLocationResult) {
    const { name, address, longitude, latitude } = data

    const promises = []
    promises.push(this.hefengService.getLocationId(longitude, latitude))
    promises.push(this.locationService.getAddressInfoByCoord(longitude, latitude))
    const [locationId, addressInfo] = await Promise.all(promises)

    return await this.weatherCityRepository.save(Object.assign({}, { name, address, longitude, latitude, locationId, userId }, addressInfo))
  }
}
