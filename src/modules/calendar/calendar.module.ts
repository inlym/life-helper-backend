import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Service
import { CalendarProjectService } from './calendar-project.service'
import { CalendarTaskService } from './calendar-task.service'

// Entity
import { CalendarProject } from './calendar-project.entity'
import { CalendarTask } from './calendar-task.entity'

// Controller
import { CalendarController } from './calendar.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CalendarProject, CalendarTask])],
  providers: [CalendarProjectService, CalendarTaskService],
  controllers: [CalendarController],
})
export class CalendarModule {}
