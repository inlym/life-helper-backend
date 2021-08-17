import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AliyunOssConfig } from 'life-helper-config'
import { OssService } from 'src/shared/oss/oss.service'
import { PlaceService } from 'src/shared/place/place.service'
import { Repository } from 'typeorm'
import { AddDiaryRequestDto } from './diary.dto'
import { Diary } from './diary.entity'
import { Media, YearMonthDay } from './diary.model'

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
  async getAll(userId: number): Promise<Diary[]> {
    const list = await this.diaryRepository.find({
      select: ['id', 'content', 'images', 'videos', 'createTime'],
      where: { userId },
      order: { id: 'DESC' },
    })

    return list
  }

  /**
   * 将视频和图片资源合并成一个资源数组
   *
   * @param videos 视频列表
   * @param images 图片列表
   */
  mergeVideoAndImage(videos: string[], images: string[]): Media[] {
    const baseURL = AliyunOssConfig.res.url

    const videoList = videos.map((path: string) => {
      const url = baseURL + '/' + path
      return {
        type: 'video',
        path: path,
        url: url,
        coverUrl: this.ossService.getVideoSnapshot(url),
      } as Media
    })

    const imageList = images.map((path: string) => {
      return {
        type: 'image',
        path: path,
        url: baseURL + '/' + path,
      } as Media
    })

    return videoList.concat(imageList)
  }

  /**
   * 转化时间对象为年月日格式
   *
   * @param t 时间
   */
  splitDate(t: Date): YearMonthDay {
    const year = t.getFullYear()
    const month = t.getMonth() + 1
    const day = t.getDate()
    return { year, month, day }
  }

  /**
   * 转化成客户端可以使用的格式
   *
   * @param diary
   */
  transformDiary(diary: Diary) {
    const date = this.splitDate(diary.createTime)
    const medias = this.mergeVideoAndImage(diary.videos, diary.images)

    return {
      id: diary.id,
      content: diary.content,
      medias,
      date,
    }
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
