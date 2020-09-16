'use strict'

/**
 * 当前文件整合常用引用的内部模块，统一输出
 */

// MySQL
const mysql = require('./database/mysql.js')

// Redis
const redis = require('./database/redis.js')

// logger
const log4js = require('log4js')
const logger = log4js.getLogger()
logger.level = 'debug'

module.exports = {
	mysql,
	redis,
	logger,
}
