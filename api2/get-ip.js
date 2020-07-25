'use strict'

/**
 * name    =>  get_ip
 * 
 * method  =>  GET
 * path    =>  /ip
 */

module.exports = async function getIp(ctx, next) {
	ctx.body = {
		ip: ctx.ip
	}
}