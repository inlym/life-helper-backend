import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { Diary } from './diary.entity'
import { DiaryService } from './diary.service'
import { DiaryController } from './diary.controller';

@Module({
  providers: [DiaryService],
  imports: [SharedModule, TypeOrmModule.forFeature([Diary])],
  exports: [DiaryService],
  controllers: [DiaryController],
})
export class DiaryModule {}
