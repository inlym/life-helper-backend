/**
 * 用户登录、获取用户身份相关
 */


'use strict'

const Redis = require('ioredis')
const { REDIS_MAIN_CONFIG } = require('../config/config.global')
const { generateRandomString } = require('../utils/string')




/**
 * 为指定用户ID生成 token, 并存入 Redis
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

	// 生成1个32位长度的随机字符创(未检测是否重复)用作token
	const token = generateRandomString(32)

	await redis.set('token:' + token, userId)
	await redis.quit()
	
	return Promise.resolve(token)
}



module.exports = {
	createTokenForSpecificUserId,
}