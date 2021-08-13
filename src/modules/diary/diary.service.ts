import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PlaceService } from 'src/shared/place/place.service'
import { Repository } from 'typeorm'
import { AddDiaryRequestDto } from './diary.dto'
import { Diary } from './diary.entity'

@Injectable()
export class DiaryService {
  constructor(private readonly placeService: PlaceService, @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>) {}

  /**
   * 新增一条生活记录
   *
   * @param userId 用户 ID
   * @param data 客户端提交数据
   */
  async add(userId: number, data: AddDiaryRequestDto): Promise<Diary> {
    const diary = this.diaryRepository.create()

    diary.userId = userId
    diary.content = data.content
    diary.photos = data.photos || []
    diary.videos = data.videos || []

    if (data.location) {
      const place = await this.placeService.add(data.location)
      diary.placeId = place.id
    }
    await this.diaryRepository.save(diary)
    return diary
  }

  /**
   * 获取详情
   *
   * @param userId
   * @param diaryId
   * @returns
   */
  async getOne(userId: number, diaryId: number): Promise<Diary> {
    const diary = await this.diaryRepository.findOne(diaryId)
    if (diary && diary.userId === userId) {
      return diary
    }
  }
}
