import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { AuthService } from 'src/modules/auth/auth.service'
import { UserService } from 'src/modules/user/user.service'
import { ExtRequest, RequestUser } from './common.interface'

/**
 * 鉴权中间件
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 鉴权信息会放在请求头的 `Authorization` 字段。
 * 2. 鉴权信息格式 `TOKEN ${token}` 或 `CODE ${code}`。
 * ```
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name)

  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  async use(request: ExtRequest, response: Response, next: NextFunction): Promise<void> {
    const user: RequestUser = request.user || { id: 0, authType: 'none' }

    const authValue = request.get('authorization')

    if (authValue) {
      const [type, value] = authValue.split(' ')
      if (type && type.toUpperCase() === 'TOKEN') {
        user.id = await this.authService.getUserIdByToken(value)
        user.authType = 'token'
      } else if (type && type.toUpperCase() === 'CODE') {
        user.id = await this.userService.getUserIdByCode(value)
        user.authType = 'code'
      } else {
        this.logger.debug(`错误的鉴权信息格式，authorization => ${authValue}`)
      }
    }

    // 挂载 `user` 对象
    request.user = user

    next()
  }
}
