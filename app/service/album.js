'use strict'

const { Service } = require('egg')

class AlbumService extends Service {
  /**
   * 创建相册
   * @param {object} options
   * @param {number} options.userId 创建人用户 ID
   * @param {string} options.name 相册名称
   * @param {string} options.ip 发起请求的客户端 IP 地址
   */
  async createAlbum(options) {
    const { app } = this
    const { userId, name, ip } = options
    const row = { name, createUserId: userId, ownUserId: userId, ip }
    return await app.model.Album.create(row)
  }

  /**
   * 更新相册基本信息
   * @param {number} albumId 相册 ID
   * @param {object} options
   */
  async updateAlbumInfo(albumId, options) {
    const { app } = this
    const props = ['name', 'coverImage']
    const values = {}
    props.forEach((element) => {
      if (options[element]) {
        values[element] = options[element]
      }
    })
    return await app.model.Album.update(values, { where: { albumId } })
  }

  /**
   * 获取指定用户的相册列表
   * @param {number} userId
   */
  async getAlbumList(userId) {
    const { app } = this
    const { count, rows } = await app.model.Album.findAndCountAll({
      where: {
        ownUserId: userId,
      },
      attributes: ['id', 'name', 'coverImage'],
      order: [['id', 'DESC']],
    })
    return { count, list: rows }
  }

  /**
   * 获取指定相册的照片列表
   * @param {number} albumId 相册 ID
   */
  async getAlbumPhotos(albumId) {
    const { app } = this
    const { count, rows } = await app.model.Photo.findAndCountAll({
      where: {
        albumId,
      },
      attributes: ['id', 'photoId'],
      order: [['id', 'DESC']],
    })
    return { count, list: rows }
  }
}

module.exports = AlbumService
