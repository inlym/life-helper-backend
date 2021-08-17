/** 视频或图片资源 */
export interface Media {
  /** 类型 */
  type: 'image' | 'video'

  /** 路径，即 `video/xxx` 或 `image/xxx` 格式的字符串 */
  path: string

  /** 完整的资源 URL 地址 */
  url: string

  /** 视频封面图 */
  coverUrl?: string
}

/** 年月日格式对象 */
export interface YearMonthDay {
  /** 年 */
  year: number

  /** 月 */
  month: number

  /** 日 */
  day: number
}
