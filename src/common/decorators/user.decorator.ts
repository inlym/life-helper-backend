import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: undefined | string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user
  if (data && typeof data === 'string') {
    return user[data]
  } else {
    return user
  }
})
