'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const launch = require('koa-to-serverless')
const debug = require('koa-debug')
const router = require('./app/router.js')
const { logger } = require('./app/common.js')

const app = new Koa()

const PORT = process.env.PORT

app.use(
	debug({
		disable: false,
		mode: 'response',
	})
)
app.use(bodyParser())
app.use(router.routes())

/** 原生环境入口 */
if (require.main === module) {
	app.listen(PORT, '0.0.0.0', () => {
		logger.log(`服务器已启动, pid: ${process.pid}`)
	})
}

/** Serverless 环境入口 */
module.exports.handler = launch(app)
