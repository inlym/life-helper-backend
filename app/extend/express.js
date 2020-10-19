'use strict'

const axios = require('axios')

const { logger } = require('../common.js')

const { ALIYUN_MARKET_API_APPCODE } = require('../common.js').CONFIG
const { EXPRESS_API_APPCODE } = ALIYUN_MARKET_API_APPCODE

/**
 *  获取快递信息
 *
 *  阿里云市场第三方 API
 *  https://market.aliyun.com/products/56928004/cmapi021863.html
 *
 * @param {string} expressNumber 快递单号
 *
 */
async function getExpressInfo(expressNumber) {
	if (!expressNumber || typeof expressNumber !== 'string') {
		throw new Error('参数错误: 快递单号(expressNumber)为空或非字符串')
	}

	const request = {
		url: 'http://wuliu.market.alicloudapi.com/kdi',
		method: 'GET',
		params: {
			no: expressNumber,
		},
		headers: {
			Authorization: `APPCODE ${EXPRESS_API_APPCODE}`,
		},
	}

	const response = await axios(request)

	const SUCCESS_STATUS = '0'
	if (response.data.status === SUCCESS_STATUS) {
		return response.data.result
	} else {
		logger.error(JSON.stringify(response.data))
		return Promise.reject(new Error(response.data.msg))
	}
}

module.exports = {
	getExpressInfo,
}
