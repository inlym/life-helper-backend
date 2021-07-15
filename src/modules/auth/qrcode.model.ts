/**
 * 认证信息状态，用于 [IAuthentication.status]
 *
 * 备注：
 * 1. 状态迁移过程：[Created] -> [Visited] -> [Checked] -> [Consumed]
 * 2. `Visited` 状态未参与业务逻辑，只用于优化界面显示：扫码后，被扫的二维码能够显示被扫码的状态
 */
export enum AuthenticationStatus {
  Created = 0,
  Visited = 1,
  Checked = 2,
  Consumed = 3,
}

export interface IAuthentication {
  /**
   * 当前状态
   */
  status: number

  /**
   * 创建时间（时间戳）
   */
  createTime: number

  /**
   * 初次访问时间（时间戳）
   *
   * 1. 对于小程序码就是扫码时间
   */
  visitTime: number

  /**
   * 认证时间（时间戳）
   */
  checkTime: number

  /**
   * 使用时间（时间戳）
   * 认证后可用于生成登录凭证，但是只允许使用一次
   */
  consumeTime: number

  /**
   * 进行认证的用户 ID（`0` 表示未认证）
   */
  userId: number
}

export interface QrcodeProfile {
  /**
   * 校验码
   */
  code: string

  /**
   * 小程序的的 URL
   */
  url: string
}

export interface QueryQrcodeResult {
  status: number
  userId: number
}
