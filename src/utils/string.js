'use strict'


const crypto = require('crypto')



/**
 * 生成一个指定长度的随机字符串（仅包含英文字符）
 * 
 * @param {number} length 待生成的随机字符串长度
 * @returns {string} 
 */
function generateRandomString(length) {
	const buf = crypto.randomBytes(length)
	const randomString = buf.toString('base64').replace(/\+/g, '').replace(/\//g, '').replace(/=/g, '')

	if(randomString.length < length){
		return generateRandomString(length)
	}else{
		return randomString.slice(0, length)
	}
}



module.exports = {
	generateRandomString
}