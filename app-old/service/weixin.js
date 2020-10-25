'use strict'

const axios = require('axios')

const { CONFIG } = require('../common.js')
const { MINIPROGRAM_DEVELOPER_ID } = CONFIG

/**
 *  从微信服务器获取服务端用的 access_token, 用于我方服务端和微信服务端之间交互
 *
 *  微信开发文档地址：
 *  https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
 *
 * @returns {Promise} {"access_token":"xxxxxx","expires_in":7200}
 *
 */
async function fetchServerAccessToken() {
	const request = {
		method: 'GET',
		url: 'https://api.weixin.qq.com/cgi-bin/token',
		params: {
			// eslint-disable-next-line camelcase
			grant_type: 'client_credential',
			appid: MINIPROGRAM_DEVELOPER_ID.appid,
			secret: MINIPROGRAM_DEVELOPER_ID.secret,
		},
	}

	const response = await axios(request)

	if (response.data.errcode) {
		return Promise.reject(
			new Error(
				`外部错误: 微信服务端报错, 错误码: ${response.data.errcode}, 错误信息:${response.data.errmsg}`
			)
		)
	} else {
		return response.data
	}
}

/**
 *  通过从小程序端获取的 code 去微信服务器换取 openid 等信息
 *
 *  微信开发文档地址：
 *  https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
 *
 * @param {string} code 从小程序端获取的 code
 * @returns {Promise} {openid,session_key,unionid}
 */
async function fetchSessionByCode(code) {
	if (!code || typeof code !== 'string') {
		throw new Error('参数错误: code为空或非字符串')
	}

	const request = {
		method: 'GET',
		url: 'https://api.weixin.qq.com/sns/jscode2session',
		params: {
			appid: MINIPROGRAM_DEVELOPER_ID.appid,
			secret: MINIPROGRAM_DEVELOPER_ID.secret,
			// eslint-disable-next-line camelcase
			js_code: code,
			// eslint-disable-next-line camelcase
			grant_type: 'authorization_code',
		},
	}

	const response = await axios(request)

	if (response.data.errcode) {
		return Promise.reject(
			new Error(
				`外部错误: 微信服务端报错, 错误码: ${response.data.errcode}, 错误信息:${response.data.errmsg}`
			)
		)
	} else {
		return response.data
	}
}

module.exports = {
	fetchServerAccessToken,
	fetchSessionByCode,
}
