import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ERRORS } from 'src/common/errors.constant'
import { Repository } from 'typeorm'
import { CalendarProject } from './calendar-project.entity'
import { CreateProjectRequestDto } from './calendar.dto'

@Injectable()
export class CalendarProjectService {
  constructor(
    @InjectRepository(CalendarProject)
    private readonly calendarProjectRepository: Repository<CalendarProject>
  ) {}

  getAll(userId: number): Promise<CalendarProject[]> {
    return this.calendarProjectRepository.find({
      select: ['id', 'name'],
      where: { userId },
      order: { id: 'DESC' },
    })
  }

  async getOne(userId: number, projectId: number) {
    const project = await this.calendarProjectRepository.findOne(projectId)

    if (!project) {
      throw new HttpException(ERRORS.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (userId !== project.userId) {
      throw new HttpException(ERRORS.RESOURCE_UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    return project
  }

  create(userId: number, data: CreateProjectRequestDto): Promise<CalendarProject> {
    return this.calendarProjectRepository.save(Object.assign({}, data, { userId }))
  }

  delete(userId: number, projectId: number) {
    return this.calendarProjectRepository.softDelete({ id: projectId, userId })
  }
}
