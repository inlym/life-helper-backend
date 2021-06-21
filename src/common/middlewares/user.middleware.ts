import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from 'src/modules/auth/auth.service'
import { UserService } from 'src/modules/user/user.service'
import { WeixinService } from 'src/modules/weixin/weixin.service'
import { RequestUser } from 'src/common/interfaces/request-user.interface'

interface NewRequest extends Request {
  user: RequestUser
}

interface parsedAuthParams {
  code?: string
  token?: string
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private authService: AuthService, private userService: UserService, private weixinService: WeixinService) {}

  async use(req: NewRequest, res: Response, next: NextFunction) {
    const { token, code } = this.parseAuthParams(req)
    const user: RequestUser = req.user || { id: 0, authType: '' }

    if (token) {
      user.id = await this.authService.getUserIdByToken(token)
      user.authType = 'token'
    } else if (code) {
      const { openid, unionid } = await this.weixinService.getSession(code)
      user.id = await this.userService.findOrCreateUserByOpenid(openid, unionid)
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
  parseAuthParams(req: NewRequest): parsedAuthParams {
    if (req.query.token && typeof req.query.token === 'string') {
      return { token: req.query.token }
    }

    if (req.query.code && typeof req.query.code === 'string') {
      return { code: req.query.code }
    }

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
