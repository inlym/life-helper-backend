'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, CHAR } = app.Sequelize

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
        type: STRING(32),
        allowNull: false,
        defaultValue: '',
        comment: '相册名称',
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
        type: CHAR(32),
        allowNull: false,
        defaultValue: '',
        comment: '相册封面图的 photoId',
      },

      ip: {
        type: STRING(16),
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
    }
  )

  return Album
}
