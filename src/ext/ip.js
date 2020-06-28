'use strict'


const net = require('net')
const axios = require('axios')

const { IP_LOCATION_API_APPCODE } = require('../config/appcode')



/**
 * 通过IP地址获取所在地区
 * 
 * 外部调用API来源于阿里云云市场
 * https://market.aliyun.com/products/57002002/cmapi00035184.html
 * 
 * 
 * @param {string} ipAddress IP地址
 */
async function getLocationByIP(ipAddress) {
	if (!ipAddress) {
		throw new Error('IP地址为空')
	}

	if (!net.isIPv4(ipAddress)) {
		throw new Error('IP地址错误，不是一个正常的IPv4地址')
	}

	const response = await axios({
		url: 'https://ips.market.alicloudapi.com/iplocaltion',
		method: 'GET',
		params: {
			ip: ipAddress
		},
		headers: {
			Authorization: 'APPCODE ' + IP_LOCATION_API_APPCODE
		}
	})

	const result = response.data.result

	/**
	 * result 结构
	 * {
	 *  "nation": "中国",
	 *  "en_short": "CN",
	 *  "en_name": "China",
	 *  "province": "四川省",
	 *  "city": "绵阳市",
	 *  "district": "涪城区",
	 *  "adcode": 510703,
	 *  "lat": 31.45498,
	 *  "lng": 104.75708
	 * }
	 */

	let obj = {}
	obj.nation = result.nation
	obj.province = result.province
	obj.city = result.city
	obj.district = result.district
	obj.adcode = result.adcode
	obj.lat = result.lat
	obj.lng = result.lng

	return obj
}

