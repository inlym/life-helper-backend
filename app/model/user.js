'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize

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
        comment: '主键 id，其他地方出现的 user_id 和 userId 均表示该值',
      },

      openid: {
        type: STRING(32),
        allowNull: false,
        unique: true,
        comment: '微信小程序openid，用于唯一区分小程序用户',
      },

      lastLoginTime: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        comment: '最近一次登录时间',
      },

      loginCounter: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '登录次数',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'user',

      /** 数据表的备注 */
      comment: '用户账户表',

      /** 驼峰形式命名的属性名称转化为下划线形式的数据库列名称 */
      underscored: true,

      /** 启用时间戳 */
      timestamps: true,

      /** 使用软删字段标记删除 */
      paranoid: true,

      /** 软删时间字段名 */
      deletedAt: 'deleteTime',

      /** 创建时间字段名 */
      createdAt: 'createTime',

      /** 更新时间字段名 */
      updatedAt: 'updateTime',
    }
  )

  return User
}
