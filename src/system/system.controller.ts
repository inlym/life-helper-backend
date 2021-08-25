import { Controller, Get, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import * as os from 'os'
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
   * 查看系统运行状态
   */
  @Get('status')
  getStatus() {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      PWD: process.env.PWD,
    }

    const osInfo = {
      totalMemory: (os.totalmem() / 1024 ** 3).toFixed(2) + 'GB',
      freeMemory: (os.freemem() / 1024 ** 3).toFixed(2) + 'GB',
      hostname: os.hostname(),
      loadavg: os.loadavg(),
    }

    const processInfo = {
      /** 当前进程的用户和系统 CPU 时间使用情况 */
      cpuUsage: process.cpuUsage(),

      /** Node.js 进程的当前工作目录 */
      cwd: process.cwd(),

      /** 当前进程的 PID */
      pid: process.pid,

      /** 当前进程的父进程的 PID */
      ppid: process.ppid,

      /** 当前操作系统平台的字符串 */
      platform: process.platform,

      /** Node.js 版本字符串   */
      version: process.version,

      /** 当前 Node.js 进程已经运行的秒数 */
      uptime: process.uptime().toFixed(0) + ' 秒',
    }
    return { env, os: osInfo, ...processInfo }
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
