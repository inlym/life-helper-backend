import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/common/auth.guard'
import { User } from 'src/common/user.decorator'
import { AddDiaryRequestDto } from './diary.dto'
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
  async addDiary(@User('id') userId: number, @Body() body: AddDiaryRequestDto) {
    const diary = await this.diaryService.add(userId, body)
    return diary
  }
}
