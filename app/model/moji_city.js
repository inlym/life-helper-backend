'use strict'

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize

  /**
   * 墨迹天气 API 中使用的城市列表
   * @since 2021-02-07
   *
   * 备注：
   * 1. 该表数据由阿里云市场墨迹天气服务商提供，未做任何改动，由 Excel 转化为 CSV 后直接导入。
   * 2. 由于该表仅用于查询，无任何新增、更新等操作，因此不使用创建时间、更新时间等字段。
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
      timestamps: false,

      /** 使用软删字段标记删除 */
      paranoid: false,

      /** 创建时间字段名 */
      createdAt: false,

      /** 更新时间字段名 */
      updatedAt: false,
    }
  )

  return MojiCity
}
