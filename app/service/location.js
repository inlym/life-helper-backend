'use strict'

const net = require('net')
const axios = require('axios')
const { IP_LOCATION_API_APPCODE } = require('../common.js').CONFIG.ALIYUN_MARKET_API_APPCODE
const { logger, redis } = require('../common.js')

/**
 * 从第三方接口通过 IP 地址换取定位信息（地区、经纬度等）
 *
 * 第三方API来源于阿里云云市场
 * https://market.aliyun.com/products/57002002/cmapi00035184.html
 *
 * 数据格式（直接返回了从第三方API获取的数据）：
 *  {
 *		en_short: 'CN',
 *		en_name: 'China',
 *		nation: '中国',
 *		province: '浙江省',
 *		city: '杭州市',
 *		district: '西湖区',
 *		adcode: 330106,
 *		lat: 30.25961,
 *		lng: 120.13026
 *	}
 *
 * @param {string} ip IP地址
 * @returns {Promise}
 */
function fetchLocationByIpFrom3rdAPI(ip) {
	logger.debug('[fetchLocationByIpFrom3rdAPI] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[fetchLocationByIpFrom3rdAPI] 参数 ip => ' + ip)

	if (!ip) {
		throw new Error('参数错误: IP为空')
	}

	if (!net.isIPv4(ip)) {
		throw new Error('参数错误：IP格式错误，不是一个正确的 IPv4 地址')
	}

	return new Promise(async function (resolve, reject) {
		const response = await axios({
			url: 'https://ips.market.alicloudapi.com/iplocaltion',
			method: 'GET',
			params: {
				ip: ip,
			},
			headers: {
				Authorization: 'APPCODE ' + IP_LOCATION_API_APPCODE,
			},
		})
		logger.debug(
			'[fetchLocationByIpFrom3rdAPI] 请求第三方API，返回响应的数据为 => ' + JSON.stringify(response.data)
		)

		if (response.status !== 200) {
			reject(new Error('第三方错误：HTTP状态码非200'))
		} else if (response.data.code !== 100) {
			reject(new Error('第三方错误：错误原因：' + response.data.message))
		} else {
			resolve(response.data.result)
			logger.debug('[fetchLocationByIpFrom3rdAPI] 函数对外返回数据 => ' + JSON.stringify(response.data.result))
		}
		logger.debug('[fetchLocationByIpFrom3rdAPI] <<<<<<<<   end   <<<<<<<<')
	})
}

/**
 * 通过 IP 地址获取定位信息（用于内部函数调用）
 * @param {string} ip IP地址
 */
function getLocationByIP(ip) {
	logger.debug('[getLocationByIP] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[getLocationByIP] 参数 ip => ' + ip)

	if (!ip) {
		throw new Error('参数错误: IP地址为空')
	}

	if (!net.isIPv4(ip)) {
		throw new Error('参数错误：参数IP地址格式错误，不是一个正确的IPv4地址')
	}

	return new Promise(async function (resolve, reject) {
		const resInRedis = await redis.get('ip:' + ip)
		logger.debug('[getLocationByIP] Redis 中返回的数据 => ' + resInRedis)

		if (resInRedis) {
			// Redis 中有缓存情况，直接返回缓存记录
			logger.debug('[getLocationByIP] Redis 中存在缓存数据，直接返回该数据')
			resolve(JSON.parse(resInRedis))
		} else {
			// Redis 中没有缓存情况
			// 先获取数据
			logger.debug('[getLocationByIP] Redis 中无缓存数据，先调用[fetchLocationByIpFrom3rdAPI]函数获取')
			const location = await fetchLocationByIpFrom3rdAPI(ip)

			// 将数据缓存到 Redis, 有效期 2 天
			// 由于数据都是整体使用，因此直接使用 string, 将数据 JSON.stringify 后再存入
			await redis.set('ip:' + ip, JSON.stringify(location), 'EX', 3600 * 24 * 2)
			logger.debug('[getLocationByIP] 将获取的数据存入 Redis 中，有效期 2 天，键名为 key => ip:' + ip)
			logger.debug('[getLocationByIP] 函数对外返回的数据 => ' + JSON.stringify(location))
			resolve(location)
		}
		logger.debug('[getLocationByIP] <<<<<<<<   end   <<<<<<<<')
	})
}

module.exports = {
	fetchLocationByIpFrom3rdAPI,
	getLocationByIP,
}
