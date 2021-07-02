import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CalendarTask } from './calendar-task.entity'

@Injectable()
export class CalendarTaskService {
  constructor(@InjectRepository(CalendarTask) private readonly calendarTaskRepository: Repository<CalendarTask>) {}

  add(userId, data) {}
}
