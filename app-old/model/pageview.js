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
			comment: '访问用户的 user_id',
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

		visit_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			comment: '访问时间',
		},

		ip: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '访问者的 IP 地址',
		},
	},

	{
		tableName: 'pageview',
		createdAt: false,
		updatedAt: false,
	}
)

module.exports = PageView
