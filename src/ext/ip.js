'use strict'


const net = require('net')
const axios = require('axios')

const { IP_LOCATION_API_APPCODE } = require('../config/appcode')



/**
 * 通过IP地址获取所在定位信息（地区、经纬度等）
 * 
 * 外部调用API来源于阿里云云市场
 * https://market.aliyun.com/products/57002002/cmapi00035184.html
 * 
 * 
 * @param {string} ipAddress IP地址
 * @returns {Promise} 
 * 
 * 		返回数据格式演示：
 * 			{
 *				nation: '中国',
 *				en_short: 'CN',
 *				en_name: 'China',
 *				province: '浙江省',
 *				city: '杭州市',
 *				district: '西湖区',
 *				adcode: 330106,
 *				lat: 30.12345,
 *				lng: 120.12345
 *			}
 * 
 */
function getLocationByIP(ipAddress) {
	return new Promise(async function (resolve, reject) {
		if (!ipAddress) {
			reject(new Error('错误：IP地址为空'))
		}

		if (!net.isIPv4(ipAddress)) {
			reject(new Error('错误：IP地址格式错误'))
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

		if (response.status !== 200) {
			reject(new Error('第三方错误：HTTP状态码非200'))
		}

		if (response.data.code !== 100) {
			reject(new Error('第三方错误，错误原因：' + response.data.message))
		}

		resolve(response.data.result)
	})
}

