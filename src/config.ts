import getConfig from 'life-helper-config'
import { MysqlConfig, RedisConfig, WeixinConfig } from './common/interfaces/config.interface'

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

/** TypeORM 配置 */
export const TypeOrmOptions = {
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
