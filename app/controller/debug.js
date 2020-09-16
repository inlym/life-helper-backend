'use strict'

const { getLocationByIP } = require('../service/location.js')

module.exports = async function debug(ctx, next) {
	const request = {}
	const client = {}

	request.method = ctx.method
	request.url = ctx.url
	request.headers = ctx.headers
	request.body = ctx.body
	request.path = ctx.path
	request.query = ctx.query
	request.querystring = ctx.querystring

	client.ip = ctx.ip
	const location = await getLocationByIP(ctx.ip)
	client.location = {
		longitude: location.lng,
		latitude: location.lat,
	}

	ctx.body = {
		request,
		client,
	}

	await next()
}
