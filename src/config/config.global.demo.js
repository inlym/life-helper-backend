/**
 * ----  使用须知  ----
 * 1. 使用时，请将文件名中的 [ .demo ] 去掉，如本文件改名文 [ config.global.js ]
 * 2. 配置文件中的 [ xxxxxxxxxxxxxxxx ] 请替换成你的实际内容
 * 3. 本项目除了代码开源外，相应服务器资源不共享，请勿向本人索取
 */

'use strict'

// 环境：开发环境 => development  生产环境 => production
const STAGE = 'production'


/**
 *  主小程序开发者ID
 * 
 * 获取方式：
 *   1. 访问小程序后台，地址：https://mp.weixin.qq.com
 *   2. 登录后，依次点击：左侧菜单栏的【开发】——顶部标签栏【开发设置】，在第一项的【开发者ID】中的【AppSecret(小程序密钥)】中进行生成或重置即可
 */
const MINIPROGRAM_MAIN_DEVELOPER_ID = {
	appid: 'xxxxxxxxxxxxxxxx',
	secret: 'xxxxxxxxxxxxxxxx'
}



module.exports = {
	MINIPROGRAM_MAIN_DEVELOPER_ID,
}