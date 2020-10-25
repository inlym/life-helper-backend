'use strict'

const Router = require('koa-router')

const router = new Router()

/** ping */
const Ping = require('./controller/ping.js')
router.all('/ping', Ping.ping)

/** debug */
const Debug = require('./controller/debug.js')
router.all('/debug', Debug.debug)

/** ip */
const Ip = require('./controller/ip.js')
router.all('/ip', Ip.getIp)

module.exports = router
