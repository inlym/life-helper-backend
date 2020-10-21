'use strict'

const { DataTypes } = require('sequelize')
const { sequelize } = require('../common.js')

/**
 *  创建时间(create_time)和更新时间(update_time)字段由数据库自动维护，不在应用层处理。
 *  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
 *  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE
 *  CURRENT_TIMESTAMP COMMENT '更新时间',
 */

/** 用户账户模型 */
const User = sequelize.define(
	'User',

	{
		openid: {
			type: DataTypes.STRING,
			allowNull: false,
			comment: '微信小程序openid，用于唯一区分小程序用户',
		},

		nickname: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '微信用户昵称，从微信授权获取',
		},

		avatar_url: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '微信头像的URL，从微信授权获取',
		},

		gender: {
			type: DataTypes.TINYINT,
			allowNull: true,
			comment: '性别，0-未知，1-男性，2-女性，从微信授权获取',
		},

		country: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '用户所在国家，从微信授权获取',
		},

		province: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '用户所在省份，从微信授权获取',
		},

		city: {
			type: DataTypes.STRING,
			allowNull: true,
			comment: '用户所在城市，从微信授权获取',
		},
	},

	{
		tableName: 'user',
		createdAt: false,
		updatedAt: false,
	}
)

module.exports = User
