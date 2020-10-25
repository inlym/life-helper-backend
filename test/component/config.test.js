'use strict'

const { app, mock, assert } = require('egg-mock/bootstrap')

describe('配置信息查看', () => {
	it('查看 sequelize 配置信息', async () => {
		console.info(app.config.sequelize)
	})
})
