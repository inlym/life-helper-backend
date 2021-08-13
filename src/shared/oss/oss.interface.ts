export interface GenerateClientTokenConfig {
  /**
   * 目录名称，前面不需要 `/`
   *
   * @description
   * - [d] => 转储的资源
   * - [p] => 用户上传的图片
   * - [v] => 用户上传的视频
   */
  dirname?: 'd' | 'p' | 'v'

  /** 有效时间，单位：小时 */
  expiration?: number

  /** 上传最大体积，单位：MB */
  maxSize?: number
}

export interface ClientToken {
  key: string
  policy: string
  signature: string
  OSSAccessKeyId: string
  url: string
}
