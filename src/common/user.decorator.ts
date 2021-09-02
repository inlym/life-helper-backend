import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ExtRequest } from './common.interface'

export const User = createParamDecorator((data: undefined | string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExtRequest>()

  const user = request.user
  if (data && typeof data === 'string') {
    return user[data]
  } else {
    return user
  }
})
