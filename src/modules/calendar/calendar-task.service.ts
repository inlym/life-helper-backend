import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

import { CalendarTask } from './calendar-task.entity'
import { CalendarTaskRepository } from './calendar-task.repository'

import { CreateTaskRequestDto } from './calendar.dto'

@Injectable()
export class CalendarTaskService {
  constructor(private readonly calendarTaskRepository: CalendarTaskRepository) {}

  getAll(userId: number, projectId) {
    return this.calendarTaskRepository.find({
      select: ['id', 'title', 'content', 'projectId', 'timeType', 'startTime', 'dueTime'],
      where: { userId, projectId },
      order: { id: 'DESC' },
    })
  }

  /**
   * 获取一条任务详情
   */
  getOne(userId: number, taskId: number) {
    return this.calendarTaskRepository.findOne({ where: { userId, id: taskId } })
  }

  /**
   * 新增一条任务
   * @param userId 用户 ID
   * @param data 任务数据（多余属性已过滤）
   */
  create(userId: number, data: CreateTaskRequestDto): Promise<CalendarTask> {
    const task = this.calendarTaskRepository.create(data)
    task.userId = userId

    return this.calendarTaskRepository.save(task)
  }

  /**
   * 修改一条任务
   * @param userId 用户 ID
   * @param data 任务数据（多余属性已过滤）
   */
  async update(userId: number, taskId: number, data: CreateTaskRequestDto): Promise<CalendarTask> {
    const task = await this.calendarTaskRepository.findOne({ where: { id: taskId, userId } })

    if (!task) {
      const error = {}
      throw new HttpException(error, HttpStatus.FORBIDDEN)
    }

    this.calendarTaskRepository.merge(task, data)

    return this.calendarTaskRepository.save(task)
  }

  /**
   * 删除一条任务
   * @param userId 用户 ID
   * @param taskId 任务 ID
   */
  delete(userId: number, taskId: number) {
    return this.calendarTaskRepository.softDelete({ userId, id: taskId })
  }
}
