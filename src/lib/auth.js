/**
 * 用户登录、获取用户身份相关
 */


'use strict'

const Redis = require('ioredis')
const { REDIS_MAIN_CONFIG } = require('../config/config.global')
const { generateRandomString } = require('../utils/string')



/**
 * 为指定用户ID生成 token, 并存入 Redis (有效期 2 天)
 * 
 * 备注：
 * 1. 未检测重复性，可能同个 userId 存在多个 token, 目前允许这种情况存在
 * 
 * [ Redis ]
 * key   => token:[token]
 * value => [userId]
 * type  => string
 * 
 * @param {number} userId 
 * @returns {Promise} resolve(token)
 */
async function createTokenForSpecificUserId(userId) {
	if (!userId || typeof userId !== 'number') throw new Error('参数错误: userId为空或非数字')

	const redis = new Redis(REDIS_MAIN_CONFIG)

	// 生成 1 个 32 位长度的随机字符创(未检测是否重复)用作 token
	const token = generateRandomString(32)

	// 保存 token, 有效期 2 天
	await redis.set('token:' + token, userId, 'EX', 3600 * 24 * 2)
	await redis.quit()

	return Promise.resolve(token)
}



/**
 * 通过 token 获取用户ID (如果 token 不存在，则返回 -1)
 * 
 * [ Redis ] 
 * key   => token:[token]
 * value => [userId]
 * type  => string
 * 
 * @param {string} token 
 * @returns {Promise} resolve(userId)
 */
async function getUserIdByToken(token) {
	if (!token || typeof token !== 'string') throw new Error('参数错误: token为空或非字符串')

	const redis = new Redis(REDIS_MAIN_CONFIG)

	const result = await redis.get('token:' + token)
	await redis.quit()

	if (!result) {
		// 如果查询的 token 不存在，则返回 -1
		return Promise.resolve(-1)
	} else {
		// 获取到的 userId 为 string, 转为 number
		userId = parseInt(result)

		return Promise.resolve(userId)
	}
}



module.exports = {
	createTokenForSpecificUserId,
	getUserIdByToken,
}