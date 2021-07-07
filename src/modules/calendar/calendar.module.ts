import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CalendarProject } from './calendar-project.entity'
import { CalendarProjectService } from './calendar-project.service'
import { CalendarTask } from './calendar-task.entity'
import { CalendarTaskService } from './calendar-task.service'
import { CalendarController } from './calendar.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CalendarProject, CalendarTask])],
  providers: [CalendarProjectService, CalendarTaskService],
  controllers: [CalendarController],
})
export class CalendarModule {}
