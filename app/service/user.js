'use strict'

const { mysql } = require('../common.js')

/**
 *  通过 opeid 从用户表中查询用户 id。
 *  如果用户存在则直接返回正整数用户 id，如果用户不存在则返回 0
 *
 * @param {string} openid
 * @returns {number} userId
 */
async function getUserIdByOpenid(openid) {
	if (!openid || typeof openid !== 'string') {
		throw new Error('参数错误: openid为空或非字符串')
	}

	const NOT_EXIST_USER_ID = 0

	const result = await mysql.get('user', {
		openid,
	})

	if (!result) {
		return NOT_EXIST_USER_ID
	} else {
		return result.id
	}
}

/**
 *  在判断 openid 不存在的情况下，创建新用户，并返回用户 id
 *  - 调用该函数前，请先进行 openid 是否存在检测
 *
 * @param {string} openid
 */
async function createNewUser(openid) {
	if (!openid || typeof openid !== 'string') {
		throw new Error('参数错误: openid为空或非字符串')
	}

	const row = {
		openid,
	}

	const result = await mysql.insert('user', row)
	return result.insertId
}

module.exports = {
	getUserIdByOpenid,
	createNewUser,
}
