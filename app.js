'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const launch = require('koa-to-serverless')
const debug = require('koa-debug')

const router = require('./app/router')

const app = new Koa()

app.use(
	debug({
		disable: false,
		mode: 'console',
	})
)
app.use(bodyParser())
app.use(router.routes())

/** 原生环境入口 */
if (require.main === module) {
	app.listen(8090, () => {
		console.log('服务器已启动')
	})
}

/** Serverless 环境入口 */
module.exports.handler = launch(app)
