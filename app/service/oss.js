'use strict'

const OSS = require('ali-oss')
const { OSS_IMG_CONFIG } = require('../config/config.js')
const { recognizeImageType } = require('../helper/image.js')
const { getUuid4WithoutHyphen } = require('../helper/string.js')



function uploadImageToOss(buf) {
	const client = new OSS(OSS_IMG_CONFIG)

	return new Promise(async function (resolve, reject) {
		// 检查传入参数是否是一个 Buffer
		if (!Buffer.isBuffer(buf)) {
			return reject(new Error('错误: 传入uploadImageToOss函数的参数不是一个Buffer!'))
		}

		// 判断图片类型，并指定后缀名，即 abc.png 中的 png
		const extname = recognizeImageType(buf)

		// 如果不是图片则直接报错
		if (!extname) {
			return reject(new Error('错误: 传入uploadImageToOss函数的Buffer不是一张图片'))
		}

		// 使用 uuid 做文件标识，即 abc.png 中的 abc
		const identifier = getUuid4WithoutHyphen()

		// 组合文件名
		const filename = identifier + '.' + extname

		// 上传图片
		const result = await client.put(filename, buf)
		console.log(result)
		return resolve('https://img.inlym.com/' + filename)
	})
}



module.exports = {
	uploadImageToOss,
}
