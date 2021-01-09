'use strict'

module.exports = (app) => {
  const { STRING, TINYINT } = app.Sequelize

  /** 用户账户模型 */
  const User = app.model.define(
    'User',

    {
      openid: {
        type: STRING,
        allowNull: false,
        comment: '微信小程序openid，用于唯一区分小程序用户',
      },

      nickname: {
        type: STRING,
        allowNull: true,
        comment: '微信用户昵称，从微信授权获取',
      },

      avatar_url: {
        type: STRING,
        allowNull: true,
        comment: '微信头像的URL，从微信授权获取',
      },

      gender: {
        type: TINYINT,
        allowNull: true,
        comment: '性别，0-未知，1-男性，2-女性，从微信授权获取',
      },

      country: {
        type: STRING,
        allowNull: true,
        comment: '用户所在国家，从微信授权获取',
      },

      province: {
        type: STRING,
        allowNull: true,
        comment: '用户所在省份，从微信授权获取',
      },

      city: {
        type: STRING,
        allowNull: true,
        comment: '用户所在城市，从微信授权获取',
      },
    },

    {
      tableName: 'user',
      createdAt: 'create_time',
      updatedAt: 'update_time',
      paranoid: true,
      timestamps: true,
      deletedAt: 'delete_time',
    }
  )

  return User
}
