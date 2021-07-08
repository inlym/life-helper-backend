import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'
import { AuthGuard } from 'src/common/auth.guard'
import { QueryId } from 'src/common/common.dto'
import { User } from 'src/common/user.decorator'
import { CalendarProjectService } from './calendar-project.service'
import { CalendarTaskService } from './calendar-task.service'
import { CreateProjectRequestDto, CreateProjectResponseDto, CreateTaskRequestDto, GetAllTasksQueryDto } from './calendar.dto'

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private readonly calendarProjectService: CalendarProjectService, private readonly calendarTaskService: CalendarTaskService) {}

  /**
   * 获取所有的日程项目列表
   */
  @Get('projects')
  async getAllProjects(@User('id') userId: number) {
    return this.calendarProjectService.getAll(userId)
  }

  /**
   * 查看单个项目详情
   */
  @Get('project')
  async getProjectDetail(@User('id') userId: number, @Query() query: QueryId) {
    const projectId = query.id

    return this.calendarProjectService.getOne(userId, projectId)
  }

  /**
   * 新增一个日程项目
   */
  @Post('project')
  async createProject(@User('id') userId: number, @Body() body: CreateProjectRequestDto): Promise<CreateProjectResponseDto> {
    const result = await this.calendarProjectService.create(userId, body)
    return plainToClass(CreateProjectResponseDto, result)
  }

  /**
   * 删除一个日程项目
   */
  @Delete('project')
  async deleteProject(@User('id') userId: number, @Query() query: QueryId) {
    const projectId = query.id

    return this.calendarProjectService.delete(userId, projectId)
  }

  /**
   * 获取指定项目下的所有任务列表
   */
  @Get('tasks')
  async getAllTasks(@User('id') userId: number, @Query() query: GetAllTasksQueryDto) {
    const projectId = query.project_id || 0

    const list = await this.calendarTaskService.getAll(userId, projectId)
    return { list }
  }

  /**
   * 查看单个任务详情
   */
  @Get('task')
  async getTaskDetail(@User('id') userId: number, @Query('id') id: number) {
    return this.calendarTaskService.getOne(userId, id)
  }

  /**
   * 新增一条任务
   */
  @Post('task')
  async createTask(@User('id') userId: number, @Body() body: CreateTaskRequestDto) {
    const newTask = await this.calendarTaskService.create(userId, body)
    return { id: newTask.id }
  }

  /**
   * 删除一条任务
   */
  @Delete('task/:id')
  async deleteTask(@User('id') userId: number, @Param('id') id: number) {
    return this.calendarTaskService.delete(userId, id)
  }

  /**
   * 修改一条任务
   */
  @Put('task/:id')
  async updateTask(@User('id') userId: number, @Param('id') taskId: number, @Body() body: CreateTaskRequestDto) {
    return this.calendarTaskService.update(userId, taskId, body)
  }
}
