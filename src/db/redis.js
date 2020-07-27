'use strict'

const Redis = require('ioredis')
const { REDIS_MAIN_CONFIG } = require('../config/config')

const redis = new Redis(REDIS_MAIN_CONFIG)
module.exports = redis