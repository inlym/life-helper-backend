import { Body, Controller, Get, HttpException, Logger, Post, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { RedisService } from 'nestjs-redis'
import { QueryId } from 'src/common/common.dto'
import { User } from 'src/common/user.decorator'
import { DebugItemService } from './debug-item.service'
import { DebugProjectService } from './debug-project.service'

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name)

  constructor(
    private readonly redisService: RedisService,
    private readonly debugProjectService: DebugProjectService,
    private readonly debugItemService: DebugItemService
  ) {}

  /**
   * 原样返回请求内容
   */
  @Get()
  getRequestDetail(@Req() req: Request) {
    /** 从 `req` 获取并返回的属性 */
    const validKeys: string[] = [
      'method',
      'url',
      'path',
      'baseUrl',
      'originalUrl',
      'headers',
      'params',
      'query',
      'body',
      'ip',
      'ips',
      'cookies',
      'hostname',
      'subdomains',
    ]

    return validKeys.reduce((result, key) => {
      return Object.assign(result, { [key]: req[key] })
    }, {})
  }

  @Get('status')
  status() {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    }
    const processInfo = {
      cwd: process.cwd(),
      pid: process.pid,
      ppid: process.ppid,
      platform: process.platform,
      version: process.version,
      uptime: process.uptime(),
    }
    return { ...env, ...processInfo }
  }

  @Get('user')
  getUser(@User() user) {
    return user
  }

  @Get('userid')
  getUserId(@User('id') userId: number) {
    return userId
  }

  @Get('test')
  test() {
    throw new Error('自定义错误')
  }

  @Get('test2')
  test2() {
    throw new HttpException({ name: 'mark' }, 502)
  }

  @Get('query')
  query(@Query('id') id: number) {
    return { id: id, type: typeof id }
  }

  /** 测试日志 */
  @Post('logger')
  showLogger(@Body() body: any) {
    this.logger.verbose(body.content)
  }

  /** --- 下述控制器方法调试数据库的增删改查 --- */

  @Get('projects')
  async getAllProject(@User('id') userId: number) {
    const list = await this.debugProjectService.getAll(userId)
    return { list }
  }

  @Post('project')
  async createProject() {
    return this.debugProjectService.mockCreate()
  }

  @Get('project')
  async getOne(@User('id') userId: number, @Query() query: QueryId) {
    const { id } = query

    return this.debugProjectService.getOne(userId, id)
  }
}
