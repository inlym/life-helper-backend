'use strict'

/**
 * Koa 框架中运行的入口文件
 */

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const launch = require('koa-to-serverless')
const debug = require('koa-debug')

const router = require('./app/router')

const app = new Koa()

app.use(
	debug({
		disable: true,
		mode: 'console',
	})
)
app.use(bodyParser())
app.use(router.routes())

if (require.main === module) {
	app.listen(8090, () => {
		console.log('服务器已启动')
	})
}

module.exports.handler = launch(app)
