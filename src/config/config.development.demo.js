/**
 *     ----  使用须知  ----
 * 1. 使用时，请将文件名中的 [ .demo ] 去掉，如本文件改名文 [ config.development.js ]
 * 2. 配置文件中的 [ xxxxxxxxxxxxxxxx ] 请替换成你的实际内容
 * 3. 本项目除了代码开源外，相应服务器资源不共享，请勿向本人索取
 */

'use strict'

/**
 * 当前配置文件存放 开发环境(development) 的配置信息
 */

module.exports = {
	// MySQL数据库配置信息
	MYSQL_CONFIG: {
		host: 'xxxxxxxxxxxxxxxx',
		port: 3306,
		user: 'xxxxxxxxxxxxxxxx',
		password: 'xxxxxxxxxxxxxxxx',
		database: 'mp_helper_test_db'
	},


	// Redis数据库配置信息
	REDIS_CONFIG: {
		host: 'xxxxxxxxxxxxxxxx',
		port: 6379,
		family: 4,
		password: 'xxxxxxxxxxxxxxxx',
		db: 6
	},


	// 存放图片专用的阿里云OSS配置信息
	OSS_IMG_CONFIG: {
		region: 'oss-cn-hangzhou',
		accessKeyId: 'xxxxxxxxxxxxxxxx',
		accessKeySecret: 'xxxxxxxxxxxxxxxx',
		bucket: 'xxxxxxxxxxxxxxxx',
		endpoint: 'oss-cn-hangzhou.aliyuncs.com',
		internal: false
	},


	OSS_IMG_DOMAINS: {
		// 内部使用访问域名，用于内部获取 object 使用，用于不需要向用户展示 url 地址的场景
		internalUseDomain: 'xxxxxxxxxxxxxxxx',

		// 自定义的访问域名，用于需要向用户展示地址的场景
		customDomain: 'xxxxxxxxxxxxxxxx'
	},

}