import { Controller, Req, Get } from '@nestjs/common'
import { Request } from 'express'

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
}
