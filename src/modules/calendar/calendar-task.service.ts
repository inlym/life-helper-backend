import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CalendarTaskRepository } from './calendar-task.repository'

@Injectable()
export class CalendarTaskService {
  constructor(private readonly calendarTaskRepository: CalendarTaskRepository) {}

  add(userId, data) {}
}
