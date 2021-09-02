/**
 * 认证凭证信息 - 状态值
 */
export enum AuthenticationStatus {
  Created = 0,
  Scanned = 1,
  Confirmed = 2,
  Consumed = 3,
}

/**
 * 认证凭证信息
 */
export interface Authentication {
  /**
   * 状态
   *
   * ```markdown
   * [0] 已创建
   * [1] 已扫码
   * [2] 已确认登录
   * [3] 已使用（用于生成登录凭证）
   * ```
   */
  status: 0 | 1 | 2 | 3

  /** 创建时间（时间戳） */
  createTime: number

  /** 初次扫码时间（时间戳） */
  scanTime?: number

  /** 进行扫码操作的用户 ID */
  scanUserId?: number

  /** 确认登录时间（时间戳） */
  confirmTime?: number

  /** 进行确认登录操作的用户 ID */
  confirmUserId?: number

  /**
   * 使用时间（时间戳）
   *
   * 认证后可用于生成登录凭证，但是只允许使用一次
   */
  consumeTime?: number
}

/** 二维码信息 */
export interface QrcodeProfile {
  /** 校验码 */
  code: string

  /** 二维码图片的地址 */
  url: string
}
