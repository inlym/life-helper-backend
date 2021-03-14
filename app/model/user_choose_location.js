'use strict'

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize

  /**
   * 当前表记录用户手工选择定位（非自动获取定位）的数据
   * @since 2021-03-13
   *
   * 主要记录在小程序端使用 wx.chooseLocation 函数返回的数据
   * 1. 每一次选择定位的有效操作产生一条数据
   * 2. 目前主要用于天气查询的默认定位
   */
  const Model = app.model.define(
    'UserChooseLocation',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 id，暂无被关联场景',
      },

      userId: {
        type: INTEGER,
        allowNull: false,
        comment: '关联用户 ID',
      },

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

      name: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '位置名称',
      },

      address: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '详细地址',
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

      adcode: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '行政区划代码',
      },

      locationId: {
        type: STRING,
        allowNull: false,
        defaultValue: '',
        comment: '和风天气 API 中使用的 LocationId',
      },

      ip: {
        type: STRING,
        allowNull: false,
        comment: '用户操作时的 IP 地址',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'user_choose_location',

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

  return Model
}
