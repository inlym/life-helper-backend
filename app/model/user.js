'use strict'

module.exports = (app) => {
  const { STRING, TINYINT, INTEGER } = app.Sequelize

  /** 用户账户模型 */
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
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '微信小程序openid，用于唯一区分小程序用户',
      },

      nickname: {
        type: STRING,
        allowNull: true,
        comment: '微信用户昵称，从微信授权获取',
      },

      avatarUrl: {
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
      /** 数据表的表名 */
      tableName: 'user',

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
