'use strict'

const Foi = require('foi')


module.exports.ip = function (event, context, callback) {
	const { getIp } = require('./api2/ip')
	const app = new Foi({ event, context, callback })
	app.use(getIp)
	app.init()
}

module.exports.location = function (event, context, callback) {
	const { getLocation } = require('./api2/location')
	const app = new Foi({ event, context, callback })
	app.use(getLocation)
	app.init()
}