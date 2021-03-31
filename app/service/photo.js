'use strict'

const { Service } = require('egg')

/**
 * 将相册、照片相关的方法合并放置在当前文件中
 */
class PhotoService extends Service {
  /**
   * 新增相册
   * @param {object} options
   */
  async createAlbum(options) {
    const { app } = this
    const { userId, name } = options
    if (userId && name) {
      const row = { name, createUserId: userId, ownUserId: userId }
      const newAlbum = await app.model.Album.create(row)
      return newAlbum.id
    } else {
      throw new Error('创建新相册时缺少参数')
    }
  }

  /**
   * 更新相册基本信息
   * @param {number} albumId 相册 ID
   * @param {object} options
   */
  async updateAlbumInfo(albumId, options) {
    const { app } = this
    const props = ['name', 'description', 'coverImage']
    const values = {}
    props.forEach((element) => {
      if (options[element]) {
        values[element] = options[element]
      }
    })
    return await app.model.Album.update(values, { where: { albumId } })
  }
}

module.exports = PhotoService
