'use strict'

const Mysql = require('ali-rds')
const { MYSQL_CONFIG } = require('../config/config.js')

const mysql = new Mysql(MYSQL_CONFIG)

module.exports = mysql
