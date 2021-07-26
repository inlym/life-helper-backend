import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { RequestUser } from 'src/common/request-user.interface'
import { AuthService } from 'src/modules/auth/auth.service'
import { UserService } from 'src/modules/user/user.service'

interface RequestNew extends Request {
  user: RequestUser
}

interface parsedAuthParams {
  code?: string
  token?: string
}

/**
 * 鉴权中间件
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService) {}

  async use(req: RequestNew, res: Response, next: NextFunction) {
    const { token, code } = this.parseAuthParams(req)
    const user: RequestUser = req.user || { id: 0, authType: '' }

    if (token) {
      user.id = await this.authService.getUserIdByToken(token)
      user.authType = 'token'
    } else if (code) {
      user.id = await this.userService.getUserIdByCode(code)
      user.authType = 'code'
    } else {
      // empty
    }

    // 挂载 `user` 对象
    if (!req.user) {
      req.user = user
    }

    next()
  }

  /**
   * 解析参数，获取 `code` 或 `token`
   */
  parseAuthParams(req: RequestNew): parsedAuthParams {
    const authValue: string = req.get('authorization')
    if (authValue) {
      const [type, value]: string[] = authValue.split(' ')
      if (type.toLowerCase() === 'token') {
        return { token: value }
      }
      if (type.toLowerCase() === 'code') {
        return { code: value }
      }
    }

    return {}
  }
}
