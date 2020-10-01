'use strict'

// 当前文件整合常用引用的内部模块，统一输出

const Mysql = require('ali-rds')
const Redis = require('ioredis')
const loghere = require('loghere')

/** 环境：生产环境 => production, 开发环境 => development */
const NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()

const PUBLIC_CONFIG = require('./config/config.public.js')
const PRODUCTION_CONFIG = require('./config/config.production.js')
const DEVELOPMENT_CONFIG = require('./config/config.development.js')

const CONFIG = {}
if (NODE_ENV === 'production') {
	Object.assign(CONFIG, PUBLIC_CONFIG, PRODUCTION_CONFIG)
} else if (NODE_ENV === 'development') {
	Object.assign(CONFIG, PUBLIC_CONFIG, DEVELOPMENT_CONFIG)
} else {
	throw new Error('环境配置错误：未识别的 NODE_ENV')
}

/** MySQL 实例 */
const mysql = new Mysql(CONFIG.MYSQL_CONFIG)

/** Redis 实例 */
const redis = new Redis(CONFIG.REDIS_CONFIG)

// logger
const logger = loghere.getLogger()

module.exports = {
	mysql,
	redis,
	logger,
	CONFIG,
}
