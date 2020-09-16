/**
 *     ----  使用须知  ----
 * 1. 使用时，请将文件名中的 [ .demo ] 去掉，如本文件改名文 [ config.default.js ]
 * 2. 配置文件中的 [ xxxxxxxxxxxxxxxx ] 请替换成你的实际内容
 * 3. 本项目除了代码开源外，相应服务器资源不共享，请勿向本人索取
 */

'use strict'

/**
 * 当前配置文件存放与环境无关的配置信息，即所有环境共用的配置
 */

module.exports = {
	// 环境：开发环境 => development, 预发布环境 => release, 生产环境 => production
	STAGE: 'development',

	// 小程序开发者ID
	MINIPROGRAM_DEVELOPER_ID: {
		appid: 'xxxxxxxxxxxxxxxx',
		secret: 'xxxxxxxxxxxxxxxx',
	},

	// 阿里云市场购买的第三方API的APPCODE
	ALIYUN_MARKET_API_APPCODE: {
		IP_LOCATION_API_APPCODE: 'xxxxxxxxxxxxxxxx',
		MOJI_WEATHER_API_APPCODE: 'xxxxxxxxxxxxxxxx',
	},
}
