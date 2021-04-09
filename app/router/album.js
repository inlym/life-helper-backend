'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 创建相册 */
  router.post('/album', controller.album.create)

  /** 获取相册列表 */
  router.get('/album', controller.album.list)
}
