'use strict'

const { DataTypes } = require('sequelize')
const { sequelize } = require('../common.js')

/** 页面访问记录模型 */
const PageView = sequelize.define(
	'PageView',

	{
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: '访问用户的 id',
		},

		page: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '小程序页面的路径，不包含查询参数，例如 pages/index/index',
		},

		querystring: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '小程序页面的查询参数，例如 id=1',
		},
	},

	{
		tableName: 'pageview',
		createdAt: false,
		updatedAt: false,
	}
)

module.exports = PageView
