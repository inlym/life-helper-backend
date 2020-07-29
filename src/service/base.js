'use strict'


const redis = require('../db/redis')
const mysql = require('../db/mysql')

const log4js = require('log4js')
const logger = log4js.getLogger()
logger.level = 'debug'


module.exports = {
	redis,
	mysql,
	logger,
}