'use strict'

const { getLocationByIP } = require('../src/lib/ip')


/**
 * API name   =>  get_location
 * method     =>  GET
 * path       =>  /location
 * query:
 *     - ip   => 选填，为空时将取请求者的IP地址
 */
async function getLocation(ctx, next) {
	let ip = ''

	if (ctx.query.ip) {
		// 先从 query 中判断是否传 ip 参数，若有则取该 ip
		ip = ctx.query.ip
	} else {
		// 如果 query 无 ip 参数，则直接取请求者的 ip
		ip = ctx.ip
	}

	const location = await getLocationByIP(ip)

	ctx.body = location
}



module.exports = {
	getLocation,
}