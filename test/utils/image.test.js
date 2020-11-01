'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('utils/image.js', () => {
	it('识别图片类型  recognizeImageType', () => {
		/** 一张 1x1 的 png 图片的 base64 */
		const data =
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAAMSURBVAiZY/j//z8ABf4C/ljyaw4AAAAASUVORK5CYII='
		const buf = Buffer.from(data, 'base64')
		const res = app.utils.image.recognizeImageType(buf)
		console.log(`    [sample] 测试图片类型 png => ${res}`)
		assert(res === 'png')
	})
})
