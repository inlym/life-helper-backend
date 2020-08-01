'use strict'

/**
 * 用户账户相关
 */


const { redis, mysql, logger } = require('../common.js')


/**
 * 注册新用户，向 user 表中插入一条新的用户记录(在已经检测 openid 不存在的情况下)
 * 
 * [ Mysql ]
 * table => user
 * 
 * @param {string} openid 
 * @returns {Promise} resolve(userId: number)
 */
function registerNewWxUser(openid) {
	logger.debug('[registerNewWxUser] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[registerNewWxUser] 参数 openid => ' + openid)

	if (!openid || typeof openid !== 'string') throw new Error('参数错误: openid 为空或非字符串')

	return new Promise(async function (resolve, reject) {
		const sql = 'INSERT INTO user (openid) VALUES (?);'
		const value = [openid]

		const { insertId } = await mysql.query(sql, value)
		resolve(insertId)
		logger.debug('[registerNewWxUser] <<<<<<<<   end   <<<<<<<<')
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
	logger.debug('[getUserIdByOpenid] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[getUserIdByOpenid] 参数 openid => ' + openid)

	if (!openid || typeof openid !== 'string') throw new Error('参数错误: openid 为空或非字符串')

	return new Promise(async function (resolve, reject) {
		const sql = 'SELECT id FROM user where openid = ? LIMIT 1;'
		const value = [openid]

		const results = await mysql.query(sql, value)
		logger.debug('[getUserIdByOpenid] 查询数据库 results => ' + JSON.stringify(results))

		if (results.length === 0) {
			resolve(0)
		} else {
			resolve(results[0]['id'])
		}
		logger.debug('[getUserIdByOpenid] <<<<<<<<   end   <<<<<<<<')
	})
}



module.exports = {
	registerNewWxUser,
	getUserIdByOpenid,
}