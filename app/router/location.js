'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取所在位置地址描述 */
  router.get('/location/address', controller.location.address)

  /** 提交本次重新选择定位的数据 */
  router.post('/location/choose', controller.location.choose)
}
