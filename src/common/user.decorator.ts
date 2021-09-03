import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ExtRequest, RequestUser } from './common.interface'

/**
 * 用户身份自定义装饰器
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 通过 `AuthMiddleware` 中间件解析鉴权信息，并将此次访问的用户身份信息绑定在 `request` 对象的 `user` 属性上。
 * 2. 目前主要用途是：用于在控制器中获取 `userId`。
 * ```
 */
export const User = createParamDecorator((data: undefined | keyof RequestUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExtRequest>()

  const user = request.user

  if (data && typeof data === 'string' && typeof user === 'object') {
    return user[data]
  } else {
    return user
  }
})
