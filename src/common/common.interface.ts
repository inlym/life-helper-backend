import { Request } from 'express'

/** 绑定在请求对象上的用户信息对象 */
export interface RequestUser {
  /** 用户 ID */
  id: number

  /** 鉴权方式 */
  authType: 'code' | 'token' | 'none'
}

/** 扩展的请求对象 */
export interface ExtRequest extends Request {
  /** 绑定在请求对象上的用户信息对象 */
  user: RequestUser
}
