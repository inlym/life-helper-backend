/**
 * 返回响应的错误状态码
 */

export enum ErrorCode {
  /** 请求成功 */
  SUCCESS = 0,

  /**
   * `4xxxx` 系列表示权限相关错误
   */

  /** 无效的 `code` */
  INVILID_CODE = 40001,

  /** 无效的 `token` */
  INVILID_TOKEN = 40002,
}
