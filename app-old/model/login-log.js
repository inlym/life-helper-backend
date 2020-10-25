'use strict'

const { DataTypes } = require('sequelize')
const { sequelize } = require('../common.js')

/**
 *  本模型的登录指：
 *  小程序端通过 code 换取服务端下发的 token 的行为
 *
 *  当前数据表仅用于后续统计用途，无业务关联
 */

/** 用户登录日志模型 */
const LoginLog = sequelize.define(
	'LoginLog',

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

		nation: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '国家',
		},

		province: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '省份',
		},

		city: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '城市',
		},

		district: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '区县',
		},

		// 考虑到后期兼容性，使用字符串存储经纬度，使用时转换成浮点数
		longitude: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '经度',
		},

		latitude: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
			comment: '纬度',
		},
	},

	{
		tableName: 'login_log',
		createdAt: false,
		updatedAt: false,
	}
)

module.exports = LoginLog
