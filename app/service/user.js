'use strict'

const { logger } = require('../common.js')
const User = require('../model/user.js')

/**
 *  通过 openid 从用户表(user)中查询用户 id。
 *  - 如果用户存在则直接返回正整数用户 id，如果用户不存在则返回 0
 *
 * @param {string} openid
 * @returns {number} userId
 */
async function getUserIdByOpenid(openid) {
	if (!openid || typeof openid !== 'string') {
		throw new Error('参数错误: openid为空或非字符串')
	}

	const NOT_EXIST_USER_ID = 0

	const result = await User.findOne({
		where: {
			openid,
		},
	})

	if (!result) {
		logger.debug('openid 未检索到，应为新用户')
		return NOT_EXIST_USER_ID
	} else {
		logger.debug(`userId => ${result.id}`)
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

	const result = await User.create(row)
	logger.debug(`userId => ${result.id}`)
	return result.id
}

module.exports = {
	getUserIdByOpenid,
	createNewUser,
}
