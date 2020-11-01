'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('utils/string.js', () => {
	it('生成指定长度随机字符串  randomString', () => {
		const res = app.utils.string.randomString(16)
		console.log(`    [sample] randomString(16) => ${res}`)
		assert(typeof res === 'string')
	})

	it('uuid v4版本  uuidv4', () => {
		const res = app.utils.string.uuidv4()
		console.log(`    [sample] uuidv4() => ${res}`)
		assert(typeof res === 'string')
	})

	it('uuid v4版本 不带短横线  uuidv4Pure', () => {
		const res = app.utils.string.uuidv4Pure()
		console.log(`    [sample] uuidv4Pure() => ${res}`)
		assert(typeof res === 'string')
	})
})
