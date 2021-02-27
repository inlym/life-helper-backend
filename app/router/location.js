'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取所在位置地址描述 */
  router.get('/location/address', controller.location.address)
}
