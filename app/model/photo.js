'use strict'

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  /** 相册照片表 */
  const Photo = app.model.define(
    'Photo',

    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '主键 id',
      },

      albumId: {
        type: INTEGER,
        allowNull: false,
        comment: '照片所属相册 ID',
        validate: {
          min: 1,
        },
      },

      filename: {
        type: STRING(40),
        allowNull: false,
        defaultValue: '',
        comment: '照片的文件名，一般为去掉短横线的 UUID',
      },

      uploadUserId: {
        type: INTEGER,
        allowNull: false,
        comment: '上传操作的用户 ID',
        validate: {
          min: 1,
        },
      },

      uploadTime: {
        type: DATE,
        allowNull: false,
        comment: '图片上传成功的时间',
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
      tableName: 'photo',

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

  Photo.associate = function associate() {
    app.model.Photo.belongsTo(app.model.Album, { foreignKey: 'albumId' })
    app.model.Photo.belongsTo(app.model.User, { foreignKey: 'uploadUserId' })
  }

  return Photo
}