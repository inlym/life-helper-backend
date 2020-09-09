'use strict'

/**
 * Koa 框架中运行的入口文件
 */

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const debug = require('koa-debug')
const launch = require('koa-to-serverless')

const router = require('./app/router')

const app = new Koa()

app.use(debug({
    disable: true,
    mode: 'console',
}))
app.use(bodyParser())
app.use(router.routes())

module.exports.handler = launch(app)
