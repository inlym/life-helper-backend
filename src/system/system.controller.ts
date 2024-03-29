import { Controller, Get, Logger, Post, Redirect, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { GetStatusResponseDto, PingRedisResponseDto } from './system.dto'
import { SystemService } from './system.service'

@ApiTags('system')
@Controller()
export class SystemController {
  /** 日志工具 */
  private readonly logger = new Logger(SystemController.name)

  constructor(private readonly systemService: SystemService) {}

  /**
   * 接口连通性测试
   *
   *
   * ### 功能说明
   *
   * ```markdown
   * 1. 用于测试项目是否已正常启动。
   * 2. 用于负载均衡健康检查。
   * ```
   */
  @Get('ping')
  ping(): string {
    return 'pong'
  }

  /**
   * 手动调试时，经常使用根路径来访问检测项目是否已启动，避免报错，因此增加当前控制器
   */
  @Get()
  root(): string {
    return 'hello, inlym'
  }

  /**
   * 查看系统运行状态以及各运行参数
   */
  @Get('status')
  getStatus(): GetStatusResponseDto {
    return this.systemService.getSystemStatus()
  }

  /**
   * 请求调试（用于 `GET` 请求）
   *
   *
   * ### 功能说明
   *
   * ```markdown
   * 1. 将会在响应数据中原样返回接收到的请求内容（包含请求方法，请求头，请求数据及各种参数）
   * 2. 主要用于调试发送的请求是否和预想的一致。
   * ```
   */
  @Get('debug')
  debugForGet(@Req() request: Request): Partial<Request> {
    return this.systemService.pickRequestProperties(request)
  }

  /**
   * 请求调试（用于 `POST` 请求）
   *
   *
   * ### 功能说明
   *
   * ```markdown
   * 1. 同上
   * ```
   */
  @Post('debug')
  debugForPost(@Req() request: Request): Partial<Request> {
    return this.systemService.pickRequestProperties(request)
  }

  /**
   * 网站标志
   *
   *
   * ### 功能说明
   *
   * ```markdown
   * 1. 在使用浏览器直接输入 URL 访问，会自动请求获取 `/favicon.ico`，然后在标签页上显示。
   * 2. 当前项目实际上用不到 `favicon.ico`，因为这个项目对外仅提供 API 接口。
   * 3. 为避免调试的时候，控制台报错找不到 `favicon.ico`，所以加了这个。
   * ```
   */
  @Get('favicon.ico')
  @Redirect('https://www.lifehelper.com.cn/favicon.ico')
  favicon(): void {
    // 2021-08-26，这条注释仅用于占位，避免报 `no-empty-function` 错误
  }

  /**
   * 检测 Redis 的连通性
   *
   *
   * ### 功能说明
   *
   * ```markdown
   * 1. 对在 Redis 的指定字段执行 `incr` 操作，用作计数器。
   * ```
   */
  @Get('ping/redis')
  async pingRedis(): Promise<PingRedisResponseDto> {
    const result = await this.systemService.pingRedis()

    return { counter: result }
  }
}
