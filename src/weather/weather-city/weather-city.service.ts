import { Injectable } from '@nestjs/common'
import { HefengPublicService } from '../hefeng/hefeng-public.service'
import { LbsqqService } from 'src/shared/lbsqq/lbsqq.service'
import { WxChooseLocationResult } from './weather-city.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { WeatherCity } from './weather-city.entity'
import { Repository } from 'typeorm'
import { AddressInfo } from 'src/shared/lbsqq/lbsqq.model'

@Injectable()
export class WeatherCityService {
  constructor(
    private readonly hefengPublicService: HefengPublicService,
    private readonly lbsqqService: LbsqqService,

    @InjectRepository(WeatherCity)
    private readonly weatherCityRepository: Repository<WeatherCity>
  ) {}

  /**
   * 新增一个天气城市
   *
   * @param userId 用户 ID
   * @param locationInfo 小程序调用 `wx.chooseLocation` 获取的数据
   */
  async add(userId: number, locationInfo: WxChooseLocationResult): Promise<WeatherCity> {
    const { longitude, latitude } = locationInfo

    /** 2 个异步任务 */
    const promises = []

    promises.push(this.hefengPublicService.getLocationIdByCoordinate(longitude, latitude))
    promises.push(this.lbsqqService.getAddressInfo(longitude, latitude))

    const promiseResult = await Promise.all(promises)
    const locationId: string = promiseResult[0]
    const addressInfo: AddressInfo = promiseResult[1]

    const weatherCity = this.weatherCityRepository.create()

    weatherCity.userId = userId

    weatherCity.longitude = longitude
    weatherCity.latitude = latitude
    weatherCity.name = locationInfo.name
    weatherCity.address = locationInfo.address

    weatherCity.locationId = locationId

    weatherCity.adcode = addressInfo.adcode
    weatherCity.nation = addressInfo.nation
    weatherCity.province = addressInfo.province
    weatherCity.city = addressInfo.city
    weatherCity.district = addressInfo.district

    await this.weatherCityRepository.save(weatherCity)

    return weatherCity
  }

  /**
   * 获取天气城市列表
   *
   * @param userId 用户 ID
   * @param limit 限制条数
   * @param offset 偏移值
   */
  async getAll(userId: number, limit = 5, offset = 0): Promise<WeatherCity[]> {
    return await this.weatherCityRepository.find({
      select: ['id', 'locationId', 'name', 'city', 'district', 'longitude', 'latitude'],
      where: { userId },
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
    })
  }

  /**
   * 根据主键 ID 查找
   *
   * @param userId 用户 ID
   * @param id 主键 ID
   */
  async getByPk(userId: number, id: number): Promise<WeatherCity | undefined> {
    return await this.weatherCityRepository.findOne({ userId, id })
  }
}
