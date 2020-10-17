'use strict'

const crypto = require('crypto')
const uuid = require('uuid')

/**
 * 生成一个指定长度的随机字符串（仅包含英文字符）
 *
 * @param {number} length 待生成的随机字符串长度
 * @returns {string} 返回生成的随机字符串
 */
function generateRandomString(length) {
	const buf = crypto.randomBytes(length)
	const randomString = buf
		.toString('base64')
		.replace(/\+/gu, '')
		.replace(/\//gu, '')
		.replace(/[=]/gu, '')

	if (randomString.length < length) {
		return generateRandomString(length)
	} else {
		const ZERO_INDEX = 0
		return randomString.slice(ZERO_INDEX, length)
	}
}

/**
 * 生成 Version 4 (Random) 版本的 UUID，去掉其中的短横线( - )后返回
 */
function getUuid4WithoutHyphen() {
	return uuid.v4().replace(/-/gu, '')
}

module.exports = {
	generateRandomString,
	getUuid4WithoutHyphen,
}
