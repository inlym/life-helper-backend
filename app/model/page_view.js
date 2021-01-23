'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize

  /** 页面访问记录模型 */
  const PageView = app.model.define(
    'PageView',

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
        comment: '访问用户的 user_id',
      },

      page: {
        type: STRING,
        allowNull: false,
        comment: '小程序页面的路径，不包含查询参数，例如 pages/index/index',
      },

      querystring: {
        type: STRING,
        allowNull: true,
        comment: '小程序页面的查询参数，例如 id=1',
      },

      visit_time: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW,
        comment: '访问时间',
      },

      ip: {
        type: STRING,
        allowNull: false,
        comment: '访问者的 IP 地址',
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'page_view',

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

  return PageView
}
