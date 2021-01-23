'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize

  /**
   * 本模型的登录指：
   * 小程序端通过 code 换取服务端下发的 token 的行为
   * - 当前数据表仅用于后续统计用途，无业务关联
   */

  /** 用户登录日志模型 */
  const LoginLog = app.model.define(
    'LoginLog',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 id',
      },

      user_id: {
        type: INTEGER,
        allowNull: false,
        comment: '登录用户的 user_id',
      },

      login_time: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        comment: '登录时间',
      },

      code: {
        type: STRING,
        allowNull: false,
        comment: '小程序端拿到的 code',
      },

      openid: {
        type: STRING,
        allowNull: false,
        comment: '通过 code 从微信服务器换取的 openid',
      },

      token: {
        type: STRING,
        allowNull: false,
        comment: '服务端返回的 token',
      },

      ip: {
        type: STRING,
        allowNull: false,
        comment: '用户的 IP 地址',
      },

      nation: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '国家',
      },

      province: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '省份',
      },

      city: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '城市',
      },

      district: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '区县',
      },

      // 考虑到后期兼容性，使用字符串存储经纬度，使用时转换成浮点数
      longitude: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '经度',
      },

      latitude: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '纬度',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'login_log',

      /** 启用时间戳 */
      timestamps: true,

      /** 使用软删字段标记删除 */
      paranoid: true,

      /** 软删时间字段名 */
      deletedAt: 'delete_time',

      /** 创建时间字段名 */
      createdAt: 'create_time',

      /** 更新时间字段名 */
      updatedAt: 'update_time',
    }
  )

  return LoginLog
}
