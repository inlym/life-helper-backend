'use strict'

const Foi = require('foi')
const { login } = require('./api/login')

module.exports.login = function (event, context, callback) {
	const app = new Foi({ event, context, callback })
	app.use(login)
	app.init()
}