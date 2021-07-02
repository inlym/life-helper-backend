import { Controller, Req, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { RedisService } from 'nestjs-redis'
import { User } from 'src/common/user.decorator'

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  constructor(private redisService: RedisService) {}

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
}
