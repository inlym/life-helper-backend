import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { DiaryController } from './diary.controller'
import { Diary } from './diary.entity'
import { DiaryService } from './diary.service'

@Module({
  providers: [DiaryService],
  imports: [SharedModule, TypeOrmModule.forFeature([Diary])],
  exports: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
