import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Service
import { CalendarProjectService } from './calendar-project.service'
import { CalendarTaskService } from './calendar-task.service'

// Repository
import { CalendarProjectRepository } from './calendar-project.repository'
import { CalendarTaskRepository } from './calendar-task.repository'

// Controller
import { CalendarController } from './calendar.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CalendarProjectRepository, CalendarTaskRepository])],
  providers: [CalendarProjectService, CalendarTaskService],
  controllers: [CalendarController],
})
export class CalendarModule {}
