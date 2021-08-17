import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { AddDiaryRequestDto } from './diary.dto'
import { Diary } from './diary.entity'
import { DiaryService } from './diary.service'

@ApiTags('diary')
@Controller('diary')
@UseGuards(AuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /**
   * 新增一条生活记录
   */
  @Post()
  async addDiary(@User('id') userId: number, @Body() body: AddDiaryRequestDto): Promise<number> {
    const diary = await this.diaryService.add(userId, body)
    return diary.id
  }

  /**
   * 获取指定用户所有的生活记录
   */
  @Get()
  async getAllDiaries(@User('id') userId: number) {
    const list = await this.diaryService.getAll(userId)
    const transformedList = list.map((diary: Diary) => this.diaryService.transformDiary(diary))
    return { list: transformedList }
  }
}
