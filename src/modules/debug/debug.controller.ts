import { Controller, Req, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { GetEnvResponseDto } from './debug.dto'

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  /**
   * 原样返回请求内容
   */
  @Get()
  getRequestDetail(@Req() req: Request) {
    /** 从 `req` 获取并返回的属性 */
    const validKeys: string[] = ['method', 'url', 'headers', 'params', 'query', 'body', 'ip']

    return validKeys.reduce((result, key) => {
      return Object.assign(result, { [key]: req[key] })
    }, {})
  }

  /**
   * 查看环境变量
   */
  @Get('env')
  getEnv(): GetEnvResponseDto {
    return { NODE_ENV: process.env.NODE_ENV || '' }
  }

  /**
   * 查看系统信息
   */
  @Get('system')
  getSystemInfo() {
    const keys: string[] = ['arch', 'pid', 'ppid', 'platform', 'version']
    return keys.reduce((result, key) => {
      return Object.assign(result, { [key]: process[key] })
    }, {})
  }

  @Get('temp')
  temp() {
    return 'hello'
  }
}
