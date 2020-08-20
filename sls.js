'use strict'

/**
 * Serverless 中运行的入口文件
 */

const Foi = require('foi')
const router = require('./app/router')


module.exports.handler = function (event, context, callback) {
	const app = new Foi({ event, context, callback })

	app.use(router.routes())
	app.listen()
}

