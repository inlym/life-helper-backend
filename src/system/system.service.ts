import { Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class SystemService {
  /**
   * 调试时，需要查看的请求的属性值
   */
  get detectedKeys(): string[] {
    const keys: string[] = [
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

    return keys
  }

  /**
   * 挑选部分请求的属性组成新的对象
   *
   * @param request Express 中的请求对象
   */
  pickRequestProperties(request: Request) {
    return this.detectedKeys.reduce((result: Record<string, any>, key: string) => {
      result[key] = request[key]
      return result
    }, {} as Record<string, any>)
  }
}
