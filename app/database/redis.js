'use strict'

const Redis = require('ioredis')
const { REDIS_CONFIG } = require('../config/config')

const redis = new Redis(REDIS_CONFIG)

module.exports = redis
