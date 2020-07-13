/**
 * 用户相关
 */

'use strict'

const Redis = require('ioredis')
const Mysql = require('mysql')

const { MYSQL_MAIN_CONFIG, REDIS_MAIN_CONFIG } = require('../config/config.global')


/**
 * 注册新用户，向 user 表中插入一条新的用户记录
 * 
 * [ Mysql ]
 * table => user
 * 
 * @param {string} openid 
 * @returns {Promise} resolve(userId: number)
 */
function registerNewWxUser(openid) {
	if (!openid || typeof openid !== 'string') throw new Error('参数错误: openid 为空或非字符串')
	return new Promise(function (resolve, reject) {
		// Mysql 连接
		const mysql = Mysql.createConnection(MYSQL_MAIN_CONFIG)
		mysql.connect()

		const sql = 'INSERT INTO user (openid) VALUES (?);'
		const value = [openid]

		mysql.query(sql, value, function (error, results, fields) {
			if (error) {
				reject(error)
				mysql.end()
			} else {
				const insertId = results.insertId
				resolve(insertId)
				mysql.end()
			}
		})
	})
}



/**
 * 通过 openid, 从 user 表中获取用户 ID (如果 openid 不存在，则返回 0)
 * 
 * [ Mysql ]
 * table => user
 * 
 * @param {string} openid 
 * @returns {Promise} resolve(userId: number)
 */
function getUserIdByOpenid(openid) {
	if (!openid || typeof openid !== 'string') throw new Error('参数错误: openid 为空或非字符串')
	return new Promise(function (resolve, reject) {
		// Mysql 连接
		const mysql = Mysql.createConnection(MYSQL_MAIN_CONFIG)
		mysql.connect()

		const sql = 'SELECT id FROM user where openid = ? LIMIT 1;'
		const value = [openid]

		mysql.query(sql, value, function (error, results, fields) {
			if (error) {
				reject(error)
				mysql.end()
			} else {
				if (results.length === 0) {
					resolve(0)
				} else {
					resolve(results[0]['id'])
				}
				mysql.end()
			}
		})
	})

}



module.exports = {
	registerNewWxUser,
	getUserIdByOpenid,
}