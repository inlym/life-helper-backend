'use strict'

const { DataTypes } = require('sequelize')
const { sequelize } = require('../common.js')

/**
 *  本模型的登录指：
 *  小程序端通过 code 换取服务端下发的 token 的行为
 */

/** 用户登录记录模型 */
const Login = sequelize.define(
	'Login',

	{
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			comment: '登录用户的 user_id',
		},

		login_time: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
			comment: '登录时间',
		},

		code: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '小程序端拿到的 code',
		},

		token: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '服务端返回的 token',
		},

		ip: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '用户的 IP 地址',
		},
	},

	{
		tableName: 'login',
		createdAt: false,
		updatedAt: false,
	}
)

module.exports = Login
