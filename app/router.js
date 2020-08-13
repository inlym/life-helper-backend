'use strict'


const Router = require('koa-router')
const router = new Router()

const login = require('./controller/login')

router.get('/login', login.login)




module.exports = router