import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/**
 * 对普通的更新请求增加的消息提示
 */
@Injectable()
export class SuccessMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const methods = ['POST', 'PUT', 'PATCH']

    return next.handle().pipe(
      map((data) => {
        if (methods.includes(request.method)) {
          data = data || {}
          if (data.code === undefined) {
            data.code = 0
          }

          if (data.code === 0 && data.message === undefined) {
            data.message = {
              type: 100,
              title: '操作成功！',
            }
          }
        }
        return data
      })
    )
  }
}
