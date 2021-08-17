/** 生成客户端直传 OSS 凭证的配置项 */
export interface GenerateClientTokenConfig {
  /**
   * 目录名称，前面不需要 `/`
   *
   * @description
   * - [image]  => 用户上传的图片
   * - [video]  => 用户上传的视频
   */
  dirname: 'image' | 'video'

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

/** 转储目录名称 */
export type DumpDirname = 'avatar'
