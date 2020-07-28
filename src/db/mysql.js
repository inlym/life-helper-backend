'use strict'

const Mysql = require('mysql')
const { MYSQL_MAIN_CONFIG } = require('../config/config')

const connection = Mysql.createConnection(MYSQL_MAIN_CONFIG)
connection.connect()

const mysqlP = {
	query(sql, params) {
		return new Promise(function (resolve, reject) {
			connection.query(sql, params, function (error, results, fields) {
				if(error){
					reject(error)
				}else{
					resolve(results)
				}
			})
		})
	}
}


module.exports = mysqlP