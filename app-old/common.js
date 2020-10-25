'use strict'

const Redis = require('ioredis')
const loghere = require('loghere')
const Sequelize = require('sequelize')

/** 环境：生产环境 => production, 开发环境 => development */
const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()

const PUBLIC_CONFIG = require('./config/config.public.js')
const PRODUCTION_CONFIG = require('./config/config.production.js')
const DEVELOPMENT_CONFIG = require('./config/config.development.js')

/** 合并的配置项 */
const CONFIG = {}
if (NODE_ENV === 'production') {
	Object.assign(CONFIG, PUBLIC_CONFIG, PRODUCTION_CONFIG)
} else if (NODE_ENV === 'development') {
	Object.assign(CONFIG, PUBLIC_CONFIG, DEVELOPMENT_CONFIG)
} else {
	throw new Error(
		`环境配置错误：未识别的 NODE_ENV => ${process.env.NODE_ENV}`
	)
}

/** Redis 实例 */
const redis = new Redis(CONFIG.REDIS_CONFIG)

/** 日志 logger 实例 */
const logger = loghere.getLogger()

// 获取 MySQL 数据库配置信息
const { host, port, user, password, database } = CONFIG.MYSQL_CONFIG

/** ORM sequelize 实例 */
const sequelize = new Sequelize(database, user, password, {
	host,
	port,
	dialect: 'mysql',
	logging: (msg) => {
		logger.debug(msg)
	},
})

module.exports = {
	redis,
	logger,
	sequelize,
	CONFIG,
}
