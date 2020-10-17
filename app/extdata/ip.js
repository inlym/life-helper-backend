'use strict'

const net = require('net')
const axios = require('axios')

const { ALIYUN_MARKET_API_APPCODE } = require('../common.js').CONFIG
const { IP_LOCATION_API_APPCODE } = ALIYUN_MARKET_API_APPCODE

/**
 *  从第三方接口通过 IP 地址换取定位信息（地区、经纬度等）
 *
 *  第三方API来源于阿里云云市场
 *  https://market.aliyun.com/products/57002002/cmapi00035184.html
 *
 *  返回数据格式演示：
 *  {"en_short":"CN","en_name":"China","nation":"中国","province":"浙江省","city":"杭州市","district":"西湖区","adcode":330106,"lat":30.25961,"lng":120.13026}
 * @param {*} ip
 */
async function fetchLocationByip(ip) {
	if (!net.isIPv4(ip)) {
		throw new Error('参数错误：IP格式错误，不是一个正确的 IPv4 地址')
	}

	const request = {
		url: 'https://ips.market.alicloudapi.com/iplocaltion',
		method: 'GET',
		params: {
			ip: ip,
		},
		headers: {
			Authorization: `APPCODE ${IP_LOCATION_API_APPCODE}`,
		},
	}

	const response = await axios(request)

	const SUCCESS_STATUS = 200
	const SUCCESS_CODE = 100

	if (response.status !== SUCCESS_STATUS) {
		return Promise.reject(new Error('第三方错误：HTTP状态码非200'))
	} else if (response.data.code !== SUCCESS_CODE) {
		return Promise.reject(
			new Error(`第三方错误：错误原因：${response.data.message}`)
		)
	} else {
		return response.data.result
	}
}

module.exports = {
	fetchLocationByip,
}
