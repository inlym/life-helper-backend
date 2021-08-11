import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { Repository } from 'typeorm'
import { HefengService } from '../hefeng/hefeng.service'
import { WxChooseLocationResult } from './weather-city.dto'
import { WeatherCity } from './weather-city.entity'

@Injectable()
export class WeatherCityService {
  constructor(
    private readonly hefengService: HefengService,
    private readonly lbsqqService: LbsqqService,
    @InjectRepository(WeatherCity) private readonly weatherCityRepository: Repository<WeatherCity>
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
