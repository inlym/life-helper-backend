import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LbsqqService } from '../lbsqq/lbsqq.service'
import { Place } from './place.entity'
import { WxLocation } from './place.model'

@Injectable()
export class PlaceService {
  constructor(private readonly lbsqqService: LbsqqService, @InjectRepository(Place) private readonly placeRepository: Repository<Place>) {}

  /**
   * 新增一条定位数据
   *
   * @param wxLocation 从微信获取到的定位数据
   * @returns 新增记录的主键 ID
   */
  async add(wxLocation: WxLocation): Promise<Place> {
    const { longitude, latitude } = wxLocation
    const addressInfo = await this.lbsqqService.getAddressInfo(longitude, latitude)

    const place = this.placeRepository.create()
    this.placeRepository.merge(place, wxLocation, addressInfo)
    await this.placeRepository.save(place)
    return place
  }

  /**
   * 获取指定 ID 的定位数据
   *
   * @param id 主键 ID
   */
  async getOne(id: number): Promise<Place> {
    return this.placeRepository.findOne(id)
  }
}
