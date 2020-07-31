'use strict'

/**
 * 当前文件用于对外输出配置信息，请勿改动
 */


const defaultConfig = require('./config.default.js')
const developmentConfig = require('./config.development.js')
const productionConfig = require('./config.production.js')

const { STAGE } = defaultConfig
const config = defaultConfig

if (STAGE === 'development') {
	Object.assign(config, developmentConfig)
} else if (STAGE === 'production'){
	Object.assign(config, productionConfig)
}else{
	// 空
	throw new Error('环境配置异常, 请在[src/config/config.default.js]文件中配置[STAGE]: 开发环境 => development, 生产环境 => production')
}


module.exports = config