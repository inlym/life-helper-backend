'use strict'

module.exports = (app) => {
  const { STRING, TINYINT, INTEGER } = app.Sequelize

  /**
   * 用户信息表
   * 1. 将一些跟权限无关的字段从 user 表中剥离出来，将与用户信息相关的字段放置在当前表
   */
  const UserInfo = app.model.define(
    'UserInfo',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: false, // 该表主键需由外部传入，不允许传空
        comment: '主键 id，即 userId，和主表 user 的 id 保持一致',
      },

      nickName: {
        type: STRING(32),
        allowNull: false,
        defaultValue: '',
        comment: '微信用户昵称，从微信授权获取',
      },

      avatarUrl: {
        type: STRING(128),
        allowNull: false,
        defaultValue: '',
        comment: '微信头像的URL，从微信授权获取',
      },

      gender: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '性别，0-未知，1-男性，2-女性，从微信授权获取',
      },

      country: {
        type: STRING(16),
        allowNull: false,
        defaultValue: '',
        comment: '用户所在国家，从微信授权获取',
      },

      province: {
        type: STRING(16),
        allowNull: false,
        defaultValue: '',
        comment: '用户所在省份，从微信授权获取',
      },

      city: {
        type: STRING(32),
        allowNull: false,
        defaultValue: '',
        comment: '用户所在城市，从微信授权获取',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'user_info',

      /** 数据表的备注 */
      comment: '用户信息表',

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

  return UserInfo
}
