'use strict'

/**
 * 用户登录、获取用户身份相关
 */

const { redis, logger } = require('../common.js')
const { generateRandomString } = require('../helper/string.js')
const { code2Session } = require('./mp-openid.js')
const { registerNewWxUser, getUserIdByOpenid } = require('./user.js')

/**
 * 为指定用户 ID 生成 token, 并存入 Redis (有效期 2 天)
 *
 * 备注：
 * 1. 未检测重复性，可能同个 userId 存在多个 token, 目前允许这种情况存在
 *
 * [ Redis ]
 *   key   => token:[token]
 *   value => [userId]
 *   type  => string
 *
 * @param {number} userId
 * @returns {Promise} resolve(token)
 */
function createTokenForSpecificUserId(userId) {
	logger.debug('[createTokenForSpecificUserId] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[createTokenForSpecificUserId] 参数 userId => ' + userId)

	if (!userId || typeof userId !== 'number') throw new Error('参数错误: userId为空或非数字')

	return new Promise(async function (resolve, reject) {
		// 生成 1 个 32 位长度的随机字符创(未检测是否重复)用作 token
		const token = generateRandomString(32)
		logger.debug('[createTokenForSpecificUserId] 生成 token => ' + token)
		// 保存 token, 有效期 2 天
		await redis.set('token:' + token, userId, 'EX', 3600 * 24 * 2)

		resolve(token)
		logger.debug('[createTokenForSpecificUserId] <<<<<<<<   end   <<<<<<<<')
	})
}

/**
 * 通过 token 获取用户 ID (如果 token 不存在，则返回 0)
 *
 * [ Redis ]
 * key   => token:[token]
 * value => [userId]
 * type  => string
 *
 * @param {string} token
 * @returns {Promise} resolve(userId)
 */
function getUserIdByToken(token) {
	logger.debug('[getUserIdByToken] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[getUserIdByToken] 参数 token => ' + token)

	if (!token || typeof token !== 'string') throw new Error('参数错误: token为空或非字符串')

	return new Promise(async function (resolve, reject) {
		let userId = await redis.get('token:' + token)
		logger.debug('[getUserIdByToken] 从Redis中获取 userId => ' + userId)

		if (!userId) {
			// 如果查询的 token 不存在，则返回 0
			resolve(0)
			logger.debug('[getUserIdByToken] token不存在, 返回0')
		} else {
			// 获取到的 userId 为 string, 转为 number

			userId = parseInt(userId)
			resolve(userId)
			logger.debug('[getUserIdByToken] 返回 userId => ' + userId)
		}
		logger.debug('[getUserIdByToken] <<<<<<<<   end   <<<<<<<<')
	})
}

/**
 * 小程序端登录 => 小程序上传 code 给服务端，服务端回传 token 回去 (用户未注册则自动完成注册流程)
 * @param {string} code
 * @returns {Promise} resolve(token)
 */
function wxLogin(code) {
	logger.debug('[wxLogin] >>>>>>>>  start  >>>>>>>>')
	logger.debug('[wxLogin] 参数 code => ' + code)

	if (!code || typeof code !== 'string') throw new Error('参数错误: code为空或非字符串')

	return new Promise(async function (resolve, reject) {
		// 请求微信通过 code 换取 openid
		const { openid } = await code2Session(code)
		logger.debug('[wxLogin] 获取 openid => ' + openid)

		if (!openid || typeof openid !== 'string') {
			reject(new Error('外部错误: 获取微信 openid 失败'))
			return
		}

		// 通过 openid 从数据库中查找 userId
		// 用户可能不存在，返回 userId 为 0
		let userId = await getUserIdByOpenid(openid)
		logger.debug('[wxLogin] 通过 openid, 获取 userId (为0表示不存在该用户) => ' + userId)

		if (!userId) {
			// 查找用户不存在则先注册，再拿到 userId
			userId = await registerNewWxUser(openid)
			logger.debug('[wxLogin] 用户不存在, 进入注册用户环节, 注册后获取 userId => ' + userId)
		}

		// 为该 userId 生成 token
		const token = await createTokenForSpecificUserId(userId)
		logger.debug('[wxLogin] 为 userId => ' + userId + ' , 生成 token => ' + token)
		resolve(token)
		logger.debug('[wxLogin] <<<<<<<<   end   <<<<<<<<')
	})
}

module.exports = {
	createTokenForSpecificUserId,
	getUserIdByToken,
	wxLogin,
}
