import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from 'src/modules/auth/auth.service'
import { UserService } from 'src/modules/user/user.service'

interface NewRequest extends Request {
  userId: number
}

interface parsedParams {
  code?: string
  token?: string
}

@Injectable()
export class UseridMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService) {}

  async use(req: NewRequest, res: Response, next: NextFunction) {
    const { token, code } = this.parseParams(req)

    if (token) {
      req.userId = await this.authService.getUserIdByToken(token)
    } else if (code) {
      // ...
    } else {
      req.userId = 0
    }

    next()
  }

  /**
   * 解析参数，获取 `code` 或 `token`
   */
  parseParams(req: NewRequest): parsedParams {
    if (req.query.token) {
      return { token: req.query.token.toString() }
    }

    if (req.query.code) {
      return { code: req.query.code.toString() }
    }

    const authValue: string = req.get('authorization')
    const [type, value]: string[] = authValue.split(' ')
    if (type.toLowerCase() === 'token') {
      return { token: value }
    }
    if (type.toLowerCase() === 'code') {
      return { code: value }
    }

    return {}
  }
}
