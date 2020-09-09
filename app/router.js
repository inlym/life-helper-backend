'use strict'


const Router = require('koa-router')
const router = new Router()

const controller = require('require-all')(__dirname + '/controller')

// ping
router.get('/ping', controller.ping.ping)


router.get('/login', controller.login.login)



module.exports = router
