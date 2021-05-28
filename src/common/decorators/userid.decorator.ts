import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Userid = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.userId
})
