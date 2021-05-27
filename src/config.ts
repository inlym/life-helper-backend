import getConfig from 'life-helper-config'
import { MysqlConfig, RedisConfig, WeixinConfig, OssConfig } from './common/interfaces/config.interface'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

/**
 * 配置文件说明：
 * 1. 环境通过 `process.env.NODE_ENV` 指定
 * 2. 可选值：
 *     - `production`   -> 生产环境
 *     - `development`  -> 开发环境
 *     - `test`         -> 单元测试环境（跑 `jest` 命令）
 */

/** 环境名称 */
const stage: string = process.env.NODE_ENV || 'development'

const config = getConfig(stage)
const mysql: MysqlConfig = config.mysql
const redis: RedisConfig = config.redis
const weixin: WeixinConfig = config.weixin
const oss: OssConfig = config.oss

/** TypeORM 配置 */
export const TypeOrmOptions: TypeOrmModuleOptions = {
  host: mysql.host,
  port: mysql.port,
  username: mysql.username,
  password: mysql.password,
  database: mysql.database,
  type: 'mysql',
  charset: 'utf8mb4',
  timezone: '+08:00',
  entities: ['dist/**/*.entity{.ts,.js}'],

  /** 是否启用日志记录 */
  logging: stage === 'test' ? false : true,

  /** 日志记录器 */
  logger: stage === 'production' ? 'simple-console' : 'advanced-console',
  synchronize: true,
}

/** Redis 配置 */
export const RedisOtions = {
  host: redis.host,
  port: redis.port,
  password: redis.password,
  db: redis.db,
}

/** 微信小程序开发者 ID 配置 */
export const WeixinOptions = {
  appid: weixin.appid,
  secret: weixin.secret,
}

export const OssOptions = {
  /** 用于管理员手动上传资源 */
  admin: oss.admin,

  /** 用户创建上传的内容 */
  ugc: oss.ugc,

  /** 系统自动生成的内容 */
  system: oss.system,
}
