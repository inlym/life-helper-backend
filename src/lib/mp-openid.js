'use strict'

const axios = require('axios')
const { MINIPROGRAM_MAIN_DEVELOPER_ID } = require('../config/config')



/**
 * 通过从小程序端获取的 code 去微信服务器换取 openid 等信息
 * 
 * 微信开发文档地址：
 * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
 * 
 * @param {string} code 从小程序端获取的 code
 * @returns {Promise} resolve({openid,session_key,unionid})
 */
function code2Session(code) {
	if (!code || typeof code !== 'string') throw new Error('参数错误: code为空或非字符串')

	return new Promise(async function (resolve, reject) {
		const response = await axios({
			method: 'GET',
			url: 'https://api.weixin.qq.com/sns/jscode2session',
			params: {
				appid: MINIPROGRAM_MAIN_DEVELOPER_ID.appid,
				secret: MINIPROGRAM_MAIN_DEVELOPER_ID.secret,
				js_code: code,
				grant_type: 'authorization_code'
			}
		})

		if (response.data.errcode) {
			reject(new Error('外部错误: 微信服务端报错, 错误码: ' + response.data.errcode + ',错误信息: ' + response.data.errmsg))
		} else {
			resolve(response.data)
		}
	})
}



module.exports = {
	code2Session,
}