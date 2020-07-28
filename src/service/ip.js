'use strict'


const net = require('net')
const Redis = require('ioredis')
const { fetchLocationByIP } = require('../ext/ip')
const { REDIS_MAIN_CONFIG } = require('../config/config')

/**
 * 通过IPv4地址获取定位信息
 * 
 * 返回数据格式：
 *  {
 *    "en_short": "CN",
 *    "en_name": "China",
 *    "nation": "中国",
 *    "province": "浙江省",
 *    "city": "杭州市",
 *    "district": "西湖区",
 *    "adcode": 330106,
 *    "lat": 30.25961,
 *    "lng": 120.13026
 *  }
 *
 * @param {string} ip IPv4地址
 * @returns {Promise} Promise.resolve(location: object)
 * 
 */
function getLocationByIP(ip) {
	if (!ip) {
		throw new Error('参数错误: ip地址为空')
	}

	if (!net.isIPv4(ip)) {
		throw new Error('参数错误：参数IP地址格式错误，不是一个正确的IPv4地址')
	}

	return new Promise(async function (resolve, reject) {
		const redis = new Redis(REDIS_MAIN_CONFIG)

		// 首先从 Redis 中获取，看下是否有记录
		// Redis 中键名格式 key => ip:[ip]
		const resInRedis = await redis.get('ip:' + ip)

		if (resInRedis) {
			redis.quit()

			// Redis 中没有缓存情况，直接返回缓存记录
			resolve(JSON.parse(resInRedis))
		} else {
			// Redis 中没有缓存情况

			// 先获取数据
			const location = await fetchLocationByIP(ip)

			// 将数据缓存到 Redis, 有效期 2 天
			// 由于数据都是整体使用，因此直接使用 string, 将数据 JSON.stringify 后再存入
			await redis.set('ip:' + ip, JSON.stringify(location), 'EX', 3600 * 24 * 2)
			redis.quit()
			resolve(location)
		}
	})
}



module.exports = {
	getLocationByIP,
}