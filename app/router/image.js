'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取实时天气情况 */
  router.post('/img', controller.image.upload)
}
