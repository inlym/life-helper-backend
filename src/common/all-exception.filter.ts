import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { COMMON_SERVER_ERROR } from './errors.constant'
/**
 * `@Catch()` 参数为空表示捕获所有错误
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name)

  /**
   * 处理策略：
   * 已知错误（继承自 `HttpException` 的错误）直接返回定义的结果，未知错误则返回固定的默认错误提示
   */
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

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
