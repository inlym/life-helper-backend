'use strict'

const net = require('net')
const { getLocationByIP } = require('../service/location')

/**
 * 客户端获取自己的定位信息（经纬度）
 * 
 * method => GET
 * query
 *     - ip => 选填，为空时使用客户端自己的IP地址
 * body   => null
 * 
 */
async function getLocation(ctx, next) {
	let ip = ''
	if (ctx.query.ip) {
		if (!net.isIPv4(ctx.query.ip)) {
			ctx.status = 422
			ctx.body = {
				errcode: 40001,
				errmsg: '参数ip不是一个正确的IP地址'
			}
			return
		} else {
			ip = ctx.query.ip
		}
	} else {
		ip = ctx.ip
	}

	const { lat, lng } = await getLocationByIP(ip)
	ctx.body = {
		ip,
		longitude: lng,
		latitude: lat
	}

	await next()
}



module.exports = {
	getLocation,
}
