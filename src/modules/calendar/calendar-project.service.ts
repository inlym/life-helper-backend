import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CalendarProject } from './calendar-project.entity'
import { CreateProjectReqDto } from './calendar.dto'

@Injectable()
export class CalendarProjectService {
  constructor(
    @InjectRepository(CalendarProject)
    private readonly calendarProjectRepository: Repository<CalendarProject>
  ) {}

  create(userId: number, data: CreateProjectReqDto) {
    return this.calendarProjectRepository.save(Object.assign({}, data, { userId }))
  }
}
