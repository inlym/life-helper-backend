'use strict'

const MYSQL_MAIN_CONFIG = {

}



const REDIS_MAIN_CONFIG = {
	host:'xxxxxxxxxxxxxxxx',
	port:6379,
	family: 4,
	password:'xxxxxxxxxxxxxxxx',
	db: 6
}



/**
 * 阿里云 OSS 配置，详情见阿里云官方文档
 * https://help.aliyun.com/document_detail/64097.html
 * 
 * [ OSS_IMG ] 专门用来存放图片文件
 */
const OSS_IMG_CONFIG = {
	region:'oss-cn-hangzhou',
	accessKeyId:'xxxxxxxxxxxxxxxx',
	accessKeySecret:'xxxxxxxxxxxxxxxx',
	bucket:'xxxxxxxxxxxxxxxx',
	endpoint:'oss-cn-hangzhou.aliyuncs.com',
	internal:false,    // 测试环境使用公网访问 OSS
}



module.exports = {
	MYSQL_MAIN_CONFIG,
	REDIS_MAIN_CONFIG,
	OSS_IMG_CONFIG,
}