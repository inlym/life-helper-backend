'use strict'

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize

  /**
   * 墨迹天气 API 中使用的城市列表
   * @since 2021-02-07
   */
  const MojiCity = app.model.define(
    'MojiCity',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        comment: '主键 id，表示墨迹天气 API 中使用的 cityId',
      },

      province: {
        type: STRING,
        allowNull: false,
        comment: '省',
      },

      city: {
        type: STRING,
        allowNull: false,
        comment: '市',
      },

      district: {
        type: STRING,
        allowNull: false,
        comment: '区',
      },

      longitude: {
        type: STRING,
        allowNull: false,
        comment: '经度',
      },

      latitude: {
        type: STRING,
        allowNull: false,
        comment: '纬度',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'moji_city',

      /** 驼峰形式命名的属性名称转化为下划线形式的数据库列名称 */
      underscored: true,

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

  return MojiCity
}
