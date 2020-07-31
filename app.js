'use strict'

/**
 * Koa 框架中运行的入口文件
 */


const Koa = require('koa')
const app = new Koa()
const router = require('./router')

app.use(router.routes())


app.listen(8090)