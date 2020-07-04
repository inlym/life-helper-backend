/**
 *  --------------------------  使用须知  --------------------------
 *    1. 使用时，请将文件名中的 [ .demo ] 去掉，如本文件改名为 [ config.develogment.js ]
 *    2. 配置文件中的 [ xxxxxxxxxxxxxxxx ] 请替换成你的实际内容
 *    3. 本项目除了代码开源外，相应服务器等资源不共享，请勿向本人索取
 */

'use strict'

const MYSQL_MAIN_CONFIG = {
	host: 'xxxxxxxxxxxxxxxx',
	port: 3306,
	user: 'xxxxxxxxxxxxxxxx',
	password: 'xxxxxxxxxxxxxxxx',
	database: 'mp_helper_test_db'
}



const REDIS_MAIN_CONFIG = {
	host: 'xxxxxxxxxxxxxxxx',
	port: 6379,
	family: 4,
	password: 'xxxxxxxxxxxxxxxx',
	db: 6
}



/**
 * 阿里云 OSS 配置，详情见阿里云官方文档
 * https://help.aliyun.com/document_detail/64097.html
 * 
 * [ OSS_IMG ] 专门用来存放图片文件
 */
const OSS_IMG_CONFIG = {
	region: 'oss-cn-hangzhou',
	accessKeyId: 'xxxxxxxxxxxxxxxx',
	accessKeySecret: 'xxxxxxxxxxxxxxxx',
	bucket: 'xxxxxxxxxxxxxxxx',
	endpoint: 'oss-cn-hangzhou.aliyuncs.com',
	internal: false,    // 测试环境使用公网访问 OSS
}



/**
 * OSS 内文件的访问域名
 *  [ internalUseDomain ] => 内部使用访问域名，用于内部获取 object 使用，用于不需要向用户展示 url 地址的场景
 *  [ customDomain ] => 自定义的访问域名，用于需要向用户展示地址的场景
 */
const OSS_IMG_DOMAINS = {
	internalUseDomain: 'xxxxxxxxxxxxxxxx.oss-cn-hangzhou.aliyuncs.com',
	customDomain: 'xxxxxxxxxxxxxxxx'
}



module.exports = {
	MYSQL_MAIN_CONFIG,
	REDIS_MAIN_CONFIG,
	OSS_IMG_CONFIG,
	OSS_IMG_DOMAINS,
}