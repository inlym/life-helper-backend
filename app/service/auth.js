'use strict'

const { redis } = require('../common.js')
const { generateRandomString } = require('../helper/string.js')

/**
 * 为指定用户 id 生成 token 并存入 Redis。
 * 有效期 2 天
 *
 * 格式：
 * key   =>   token:${token}
 * value =>   ${userId}
 * @param {number} userId
 */
async function createTokenForUserId(userId) {
	if (!userId || typeof userId !== 'number') {
		throw new Error('参数错误: userId为空或非数字')
	}

	const TOKEN_LENGTH = 64
	// eslint-disable-next-line no-magic-numbers
	const EXPIRATION = 3600 * 24 * 2

	const token = generateRandomString(TOKEN_LENGTH)
	const result = await redis.set(`token:${token}`, userId, 'EX', EXPIRATION)
	if (result === 'OK') {
		return token
	} else {
		return Promise.reject(new Error('内部错误'))
	}
}

/**
 *  通过 token 从 Redis 中获取用户 id。
 *  如果存在则直接返回用户 id，不存在则返回 0。
 * @param {string} token
 */
async function getUserIdByToken(token) {
	if (!token || typeof token !== 'string') {
		throw new Error('参数错误: token为空或非字符串')
	}
	const NOT_EXIST_USER_ID = 0

	const result = await redis.get(`token:${token}`)
	if (!result) {
		return NOT_EXIST_USER_ID
	} else {
		return parseInt(result, 10)
	}
}

module.exports = {
	createTokenForUserId,
	getUserIdByToken,
}
