'use strict'

const crypto = require('crypto')
const uuid = require('uuid')

module.exports = () => {
	return {
		/**
		 *  生成一个指定长度的随机字符串（仅包含英文字符）
		 *
		 * @param {number} length 待生成的随机字符串长度
		 * @returns {string} 返回生成的随机字符串
		 */
		randomString(length) {
			const buf = crypto.randomBytes(length)
			const randomString = buf
				.toString('base64')
				.replace(/\+/gu, '')
				.replace(/\//gu, '')
				.replace(/[=]/gu, '')

			if (randomString.length < length) {
				return this.randomString(length)
			} else {
				const ZERO_INDEX = 0
				return randomString.slice(ZERO_INDEX, length)
			}
		},

		uuidv4() {
			return uuid.v4()
		},

		/**
		 *  生成 Version 4 (Random) 版本的 UUID，去掉其中的短横线( - )后返回
		 *
		 * 	 * @returns {string} 不带短横线的UUID
		 */
		uuidv4Pure() {
			return uuid.v4().replace(/-/gu, '')
		},
	}
}
