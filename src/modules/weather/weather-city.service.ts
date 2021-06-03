import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HefengService } from './hefeng.service'
import { LocationService } from '../location/location.service'
import { WxChooseLocationResult } from './weather.dto'
import { WeatherCity } from 'src/entities/weather-city.entity'

@Injectable()
export class WeatherCityService {
  constructor(
    private hefengService: HefengService,
    private locationService: LocationService,
    @InjectRepository(WeatherCity) private weatherCityRepository: Repository<WeatherCity>
  ) {}

  async getAll(userId: number): Promise<WeatherCity[]> {
    return await this.weatherCityRepository.find({
      select: ['id', 'locationId', 'name', 'city', 'district'],
      where: { userId },
      order: { id: 'DESC' },
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
