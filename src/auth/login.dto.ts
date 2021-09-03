import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator'

/** ────────────────────  wxLogin  ──────────────────── */

/** 微信登录 - 响应数据 */
export class WxLoginResponseDto {
  /** 登录凭证 */
  token: string

  /** 有效时长，单位：秒 */
  expiration: number
}

/** ────────────────────  scanLogin  ──────────────────── */

/** 扫码登录 - 请求参数 */
export class ScanLoginQueryDto {
  /** 校验码 */
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  code: string
}

/** 扫码登录 - 响应数据 */
export class ScanLoginResponseDto {
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
  status: number

  /** 登录凭证 */
  token?: string

  /** 有效时长，单位：秒 */
  expiration?: number
}
