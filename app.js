'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const launch = require('koa-to-serverless')
const debug = require('koa-debug')
const clientip = require('koa-clientip')
const router = require('./app/router.js')
const { logger } = require('./app/common.js')

const PORT = process.env.PORT

const app = new Koa({
	proxy: true,
})

app.use(
	clientip({
		index: -2,
	})
)
app.use(bodyParser())
app.use(router.routes())

/** 原生环境入口 */
if (require.main === module) {
	app.listen(PORT, '0.0.0.0', () => {
		logger.info(`服务器已启动, pid: ${process.pid}`)
	})
}

/** Serverless 环境入口 */
module.exports.handler = launch(app)
