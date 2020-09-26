'use strict'

const Router = require('koa-router')
const router = new Router()

// const controller = require('require-all')(__dirname + '/controller')

// ping
const Ping = require('./controller/ping')
router.all('/ping', Ping.ping)

module.exports = router
