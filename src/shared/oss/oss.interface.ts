export interface GenerateClientTokenConfig {
  /** 目录名称，前面不需要 `/` */
  dirname: string

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
