'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, CHAR } = app.Sequelize

  /**
   * 用户账户表
   * 1. 放置跟登录相关信息
   */
  const User = app.model.define(
    'User',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 id，即 userId',
      },

      openid: {
        type: STRING(32),
        allowNull: false,
        unique: true,
        comment: '微信小程序openid，用于唯一区分小程序用户',
      },

      unionid: {
        type: STRING(32),
        allowNull: false,
        defaultValue: '',
        unique: true,
        comment: '用户在开放平台的唯一标识符',
      },

      phone: {
        type: CHAR(11),
        allowNull: false,
        defaultValue: '',
        unique: true,
        comment: '账户手机号，可用于其他客户端登录',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'user',

      /** 数据表的备注 */
      comment: '用户账户表',
    }
  )

  return User
}
