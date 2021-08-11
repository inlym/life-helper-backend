import { Injectable } from '@nestjs/common'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { HefengService } from '../hefeng/hefeng.service'
import { WeatherCity } from './weather-city.entity'
import { WeatherCityRepository } from './weather-city.repository'
import { WxChooseLocationResult } from '../weather.dto'

@Injectable()
export class WeatherCityService {
  constructor(
    private readonly hefengService: HefengService,
    private readonly weatherCityRepository: WeatherCityRepository,
    private readonly lbsqqService: LbsqqService
  ) {}

  async getByPk(userId: number, id: number): Promise<WeatherCity | undefined> {
    const result = await this.weatherCityRepository.findOne(id)
    if (result && result.userId === userId) {
      return result
    }
  }

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
    promises.push(this.lbsqqService.getAddressInfo(longitude, latitude))

    const [locationId, addressInfo] = await Promise.all(promises)

    return await this.weatherCityRepository.save(Object.assign({}, { name, address, longitude, latitude, locationId, userId }, addressInfo))
  }
}
