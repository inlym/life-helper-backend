import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { COMMON_SERVER_ERROR } from './errors.constant'

/**
 * 全局异常过滤器
 *
 *
 * ## 说明
 *
 * ```markdown
 * 1. 装饰器 `@Catch()` 参数为空表示捕获所有错误。
 * ```
 *
 *
 * ### 处理策略
 *
 * ```markdown
 * 1. 继承自 `HttpException` 的错误，为已知错误，直接返回定义的结果。
 * 2. 非继承自 `HttpException` 的错误，为未知错误，返回默认的错误提示。
 * ```
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name)

  catch(exception: HttpException | Error, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()

    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const responseContent = exception.getResponse()
      this.logger.verbose(`[${request.method} ${request.url}] 已知错误`)
      response.status(status).json(responseContent)
    } else {
      this.logger.warn(`[${request.method} ${request.url}] 未知错误：${exception}`)
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(COMMON_SERVER_ERROR)
    }
  }
}
