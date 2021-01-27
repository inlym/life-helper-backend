'use strict'

module.exports = (app) => {
  const { router, controller } = app

  /** 获取用户个人资料 */
  router.get('/user/info', controller.userInfo.getUserInfo)

  /** 更新用户个人资料 */
  router.post('/user/info', controller.userInfo.updateUserInfo)
}
