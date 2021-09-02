import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiaryController } from './diary.controller'
import { Diary } from './diary.entity'
import { DiaryService } from './diary.service'

@Module({
  providers: [DiaryService],
  imports: [TypeOrmModule.forFeature([Diary])],
  exports: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
