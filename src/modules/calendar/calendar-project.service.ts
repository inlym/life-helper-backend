import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CalendarProjectRepository } from './calendar-project.repository'
import { CreateProjectReqDto } from './calendar.dto'

@Injectable()
export class CalendarProjectService {
  constructor(private readonly calendarProjectRepository: CalendarProjectRepository) {}

  create(userId: number, data: CreateProjectReqDto) {
    return this.calendarProjectRepository.save(Object.assign({}, data, { userId }))
  }
}
