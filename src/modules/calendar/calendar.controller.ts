import { Controller, UseGuards, Post, Body, Get, Delete, Query, Param } from '@nestjs/common'
import { User } from 'src/common/user.decorator'
import { AuthGuard } from 'src/common/auth.guard'
import { CreateProjectReqDto, CreateProjectResDto } from './calendar.dto'
import { CalendarProjectService } from './calendar-project.service'
import { plainToClass } from 'class-transformer'

@Controller('calendar')
@UseGuards(AuthGuard)
export class CalendarController {
  constructor(private calendarProjectService: CalendarProjectService) {}

  /**
   * 获取所有的日程项目列表
   */
  @Get('projects')
  async getProjects(@User('id') userId: number) {
    // todo
  }

  /**
   * 查看单个项目详情
   */
  @Get('project/:id')
  async getProjectDetail(@User('id') userId: number, @Param('id') id: number) {
    // todo
  }

  /**
   * 新增一个日程项目
   */
  @Post('project')
  async createProject(@User('id') userId: number, @Body() body: CreateProjectReqDto): Promise<CreateProjectResDto> {
    const result = await this.calendarProjectService.create(userId, body)
    return plainToClass(CreateProjectResDto, result)
  }

  /**
   * 删除一个日程项目
   */
  @Delete('project/:id')
  async deleteProject(@User('id') userId: number, @Param('id') id: number) {
    // todo
  }

  /**
   * 获取指定项目下的所有任务列表
   */
  @Get('tasks')
  async getTasks(@User('id') userId: number, @Query('project_id') projectId: number) {
    // todo
  }

  /**
   * 查看单个任务详情
   */
  @Get('task/:id')
  async getTaskDetail(@User('id') userId: number, @Param('id') id: number) {
    // todo
  }

  /**
   * 新增一条任务
   */
  @Post('task')
  async createTask(@User('id') userId: number, @Body() body) {
    // todo
  }

  /**
   * 删除一条任务
   */
  @Delete('task/:id')
  async deleteTask(@User('id') userId: number, @Param('id') id: number) {
    // todo
  }
}
