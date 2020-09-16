'use strict'

/**
 * 通过读文件头识别图片类型，若非图片则返回 undefined
 *
 * @param {Buffer} buf 一段Buffer
 * @returns {string|undefined} 返回图片类型
 */
function recognizeImageType(buf) {
	const PNG_BUFFER = Buffer.from('89504e470d0a1a0a', 'hex')
	const JPG_BUFFER = Buffer.from('ffd8', 'hex')
	const GIF_BUFFER = Buffer.from('47494638', 'hex')
	const BMP_BUFFER = Buffer.from('424d', 'hex')
	const ICO_BUFFER = Buffer.from('000001000100', 'hex')
	const TIFF_BUFFER_1 = Buffer.from('4d4d', 'hex')
	const TIFF_BUFFER_2 = Buffer.from('4949', 'hex')

	if (!Buffer.isBuffer(buf)) {
		throw new Error('错误：输入的参数不是一个Buffer对象')
	}

	if (buf.indexOf(PNG_BUFFER) === 0) {
		return 'png'
	} else if (buf.indexOf(JPG_BUFFER) === 0) {
		return 'jpg'
	} else if (buf.indexOf(GIF_BUFFER) === 0) {
		return 'gif'
	} else if (buf.indexOf(BMP_BUFFER) === 0) {
		return 'bmp'
	} else if (buf.indexOf(ICO_BUFFER) === 0) {
		return 'ico'
	} else if (buf.indexOf(TIFF_BUFFER_1) === 0 || buf.indexOf(TIFF_BUFFER_2) === 0) {
		return 'tiff'
	} else {
		return undefined
	}
}

module.exports = {
	recognizeImageType,
}
