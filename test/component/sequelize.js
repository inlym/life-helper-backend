'use strict'

const { app, mock, assert } = require('egg-mock/bootstrap')

describe('sequelize 连接测试', async () => {
	const res = await app.sequelize.query('select databases;')
	console.info(res)
	assert(res[1]['Database'] === 'mp_helper_test_db')
})
