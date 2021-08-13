import { Controller, Get, Logger, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { RedisService } from 'nestjs-redis'
import { OssService } from 'src/shared/oss/oss.service'
import { DiaryService } from '../diary/diary.service'

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name)

  constructor(private readonly redisService: RedisService, private readonly ossService: OssService, private readonly diaryService: DiaryService) {}

  /**
   * 原样返回请求内容
   */
  @Post()
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
}
