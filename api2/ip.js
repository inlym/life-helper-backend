'use strict'

/**
 * API name    =>  get_ip
 * 
 * method      =>  GET
 * path        =>  /ip
 */

async function getIp(ctx, next) {
	ctx.body = {
		ip: ctx.ip
	}
}



module.exports = {
	getIp,
}