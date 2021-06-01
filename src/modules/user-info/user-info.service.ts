import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInfo } from 'src/entities/user-info.entity'

@Injectable()
export class UserInfoService {
  constructor(@InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>) {}

  async getBasicInfo(userId: number): Promise<UserInfo> {
    const result = await this.userInfoRepository.findOne({ userId })
    console.log('result: ', result)
    return result
  }
}
