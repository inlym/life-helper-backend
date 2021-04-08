'use strict'

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize

  /** 相册表 */
  const Album = app.model.define(
    'Album',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 id',
      },

      name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '相册名称',
      },

      description: {
        type: STRING(300),
        allowNull: false,
        defaultValue: '',
        comment: '相册描述',
      },

      createUserId: {
        type: INTEGER,
        allowNull: false,
        comment: '相册创建人用户 ID，目前仅记录，无实际用途',
        validate: {
          min: 1,
        },
      },

      ownUserId: {
        type: INTEGER,
        allowNull: false,
        comment: '相册当前所有人用户 ID（相册可以转移到其他用户账户下）',
        validate: {
          min: 1,
        },
      },

      coverImage: {
        type: STRING(80),
        allowNull: false,
        defaultValue: '',
        comment: '相册封面图文件名',
      },

      ip: {
        type: STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '创建操作时请求的 IP 地址',
        validate: {
          isIPv4: true,
        },
      },
    },

    {
      /** 数据表的表名 */
      tableName: 'album',

      /** 数据表的备注 */
      comment: '相册表',

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

  return Album
}
