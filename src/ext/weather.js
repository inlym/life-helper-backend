'use strict'

const axios = require('axios')
const { WEATHER_API_APPCODE } = require('../config/appcode')


/**
 * 根据经纬度坐标获取所在地区天气信息(短时预报)
 * 
 * 外部调用API来源于阿里云云市场
 * https://market.aliyun.com/products/57096001/cmapi012364.html
 * 
 * @param {number} longitude 经纬度坐标之经度
 * @param {number} latitude 经纬度坐标之纬度
 */
function fetchWeatherByCoordinate(longitude, latitude) {
	return new Promise(async function (resolve, reject) {
		if (!longitude || !latitude) return reject(new Error('参数错误：经纬度坐标为空' + ' -- [fetchWeatherByCoordinate]'))

		const response = await axios({
			url: 'http://aliv8.data.moji.com/whapi/json/aliweather/shortforecast',
			method: 'POST',
			headers: {
				Authorization: 'APPCODE ' + WEATHER_API_APPCODE
			},
			data: `lat=${latitude}&lon=${longitude}&token=bbc0fdc738a3877f3f72f69b1a4d30fe`,
		})

		if (response.status !== 200) {
			return reject(new Error('第三方错误：HTTP状态码非200' + ' -- [fetchWeatherByCoordinate]'))
		}

		if (response.data.code !== 0) {
			return reject(new Error('第三方错误，错误原因：' + response.data.msg + ' -- [fetchWeatherByCoordinate]'))
		}

		resolve(response.data.data)
	})
}



module.exports = {
	fetchWeatherByCoordinate,
}