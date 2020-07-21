'use strict'

const Koa = require('koa')

const { login } = require('./api/login')

const app = new Koa()

app.use(login)

app.listen(8090)