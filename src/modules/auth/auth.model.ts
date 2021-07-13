export interface CheckInfo {
  /**
   * 创建时间（时间戳）
   */
  createTime: number

  /**
   * 是否已认证
   */
  hasChecked: boolean

  /**
   * 进行认证的用户 ID，`0` 表示未认证
   */
  userId: number

  /**
   * 认证时间（时间戳）
   */
  checkTime?: number

  /**
   * 使用时间（时间戳）
   * 认证后可用于生成登录凭证，但是只允许使用一次
   */
  useTime?: number
}
