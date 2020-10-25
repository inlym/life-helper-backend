'use strict'

const axios = require('axios')

const { logger } = require('../common.js')

const { ALIYUN_MARKET_API_APPCODE } = require('../common.js').CONFIG
const { MOBILE_LOCATION_API_APPCODE } = ALIYUN_MARKET_API_APPCODE

/**
 *  通过手机号获取定位信息
 *
 *  阿里云市场第三方 API
 *  https://market.aliyun.com/products/57126001/cmapi022206.html
 *
 * @param {string} phone 手机号码
 * @returns {object}
 * ```
 * {"num":1328256,"isp":"联通","prov":"浙江","city":"丽水","types":"中国联通","city_code":"0578","area_code":"331100","zip_code":"323000","lng":"119.922796","lat":"28.46763"}
 * ```
 */
async function fetchLocationByMobile(phone) {
	if (!phone || typeof phone !== 'string') {
		throw new Error('参数错误: phone为空或非字符串')
	}

	const request = {
		url: 'http://api04.aliyun.venuscn.com/mobile',
		method: 'GET',
		params: {
			mobile: phone,
		},
		headers: {
			Authorization: `APPCODE ${MOBILE_LOCATION_API_APPCODE}`,
		},
	}

	const response = await axios(request)
	logger.debug(JSON.stringify(response.data))

	const SUCCESS_CODE = 200
	if (response.data.ret === SUCCESS_CODE) {
		return response.data.data
	} else {
		logger.error(
			`错误码 => ${response.data.ret},错误提示 => ${response.data.msg}`
		)
		return Promise.reject(response.data.msg)
	}
}

module.exports = {
	fetchLocationByMobile,
}
