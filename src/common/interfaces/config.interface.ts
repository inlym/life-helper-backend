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

interface OssItemConfig {
  bucket: string
  url: string
  accessKeyId: string
  accessKeySecret: string
}

export interface OssConfig {
  admin: OssItemConfig
  ugc: OssItemConfig
  system: OssItemConfig
}
