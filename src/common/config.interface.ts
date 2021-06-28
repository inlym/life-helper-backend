export interface MysqlConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export interface RedisConfig {
  host: string
  port: number
  password: string
  db: number
}

export interface WeixinConfig {
  appid: string
  secret: string
}

export interface BucketInfo {
  bucket: string
  url: string
  accessKeyId: string
  accessKeySecret: string
}

export interface LbsqqConfig {
  keys: string[]
}

interface HfItem {
  baseURL: string
  key: string
}

export interface HefengConfig {
  basic: HfItem
  pro: HfItem
}
