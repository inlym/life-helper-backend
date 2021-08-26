import { Controller, Get, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { SystemService } from './system.service'

@ApiTags('system')
@Controller()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  /**
   * 接口连通性测试
   *
   *
   * @description
   *
   * ```markdown
   * 功能说明：
   * 1. 用于测试项目是否已正常启动。
   * 2. 用于负载均衡健康检查。
   * ```
   */
  @Get('ping')
  ping() {
    return 'pong'
  }

  /**
   * 查看系统运行状态以及各运行参数
   */
  @Get('status')
  getStatus() {
    return this.systemService.getSystemStatus()
  }

  /**
   * 请求调试（用于 `GET` 请求）
   */
  @Get('debug')
  debugForGet(@Req() request: Request) {
    return this.systemService.pickRequestProperties(request)
  }

  /**
   * 请求调试（用于 `POST` 请求）
   */
  @Post('debug')
  debugForPost(@Req() request: Request) {
    return this.systemService.pickRequestProperties(request)
  }
}
