import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AliyunOssConfig } from 'life-helper-config'
import { OssService } from 'src/shared/oss/oss.service'
import { PlaceService } from 'src/shared/place/place.service'
import { Repository } from 'typeorm'
import { AddDiaryRequestDto } from './diary.dto'
import { Diary } from './diary.entity'
import { AllDiaryListItem } from './diary.model'

@Injectable()
export class DiaryService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly ossService: OssService,
    @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>
  ) {}

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
    diary.images = data.images || []
    diary.videos = data.videos || []

    if (data.location) {
      const place = await this.placeService.add(data.location)
      diary.placeId = place.id
    }
    await this.diaryRepository.save(diary)
    return diary
  }

  /**
   * 获取指定用户的所有生活记录
   *
   * @param userId 用户 ID
   */
  async getAll(userId: number): Promise<AllDiaryListItem[]> {
    const list = await this.diaryRepository.find({
      select: ['id', 'content', 'images', 'videos', 'createTime'],
      where: { userId },
      order: { id: 'DESC' },
    })

    return list.map((item: Diary) => {
      const videos = item.videos.map((path: string) => AliyunOssConfig.res.url + '/' + path)
      const images = item.images.map((path: string) => AliyunOssConfig.res.url + '/' + path)

      const list = videos
        .map((url: string) => {
          return {
            type: 'video',
            url: this.ossService.getVideoSnapshot(url),
          }
        })
        .concat(
          images.map((url: string) => {
            return { type: 'image', url }
          })
        )

      const day = item.createTime.getDate()
      const month = item.createTime.getMonth() + 1
      const year = item.createTime.getFullYear()

      const date = {
        year: year === new Date().getFullYear() ? '' : year,
        month: month > 9 ? String(month) : '0' + String(month),
        day: day > 9 ? String(day) : '0' + String(day),
      }

      return { content: item.content, list, date }
    })
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
