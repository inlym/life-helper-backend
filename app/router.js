'use strict'

const Router = require('koa-router')
const debug = require('koa-debug')

const router = new Router()

// const controller = require('require-all')(__dirname + '/controller')

// ping
const Ping = require('./controller/ping')
router.all('/ping', Ping.ping)

/** debug */
router.all('/debug', debug())

module.exports = router
