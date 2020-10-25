'use strict'

const { app, mock, assert } = require('egg-mock/bootstrap')

describe('测试 MySQL 连接', () => {
	it('查看 MySQL 是否连通', async () => {
		const res = await app.mysql.query('SHOW DATABASES;')
		console.info(res)
	})
})
