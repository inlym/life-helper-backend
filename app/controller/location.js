'use strict'

const { Controller } = require('egg')

class LocationController extends Controller {
  /**
   * @api {get} /location/address 获取所在位置地址描述
   * @apiName address
   * @apiGroup location
   * @apiVersion 0.9.0
   *
   * @apiParam (Query) {Number} [longitude] 经度
   * @apiParam (Query) {Number} [latitude] 经度
   * @apiParam (Query) {String} [location] 经纬度坐标，格式：`location=${longitude},${latitude}`
   *
   * @apiDescription
   * location 参数是 longitude, latitude 2个参数的缩略形式，不要同时传递。
   */
  async address() {
    const { ctx, service } = this
    const options = service.queryhandler.handleCityIdQueries(ctx)
    let { latitude, longitude } = options
    if (!latitude || !longitude) {
      const coord = await service.location.getCoordByIp(ctx.ip)
      latitude = coord.latitude
      longitude = coord.longitude
    }
    const result = await service.location.getFormattedAddress(longitude, latitude)
    ctx.body = {
      address: result,
    }
  }

  /**
   * @api {post} /location/choose 提交本次重新选择定位的数据
   * @apiName choose
   * @apiGroup location
   * @apiVersion 0.9.0
   *
   * @apiParam (Body) {Number} name 位置名称
   * @apiParam (Body) {Number} address 详细地址
   * @apiParam (Body) {Number} longitude 经度
   * @apiParam (Body) {Number} latitude 经度
   *
   * @apiDescription
   * 小程序端直接将从 wx.chooseLocation 方法获取的数据提交，无需做任何处理
   */
  async choose() {
    const { ctx, service } = this
    const { name, address, longitude, latitude } = ctx.request.body
    const promises = []
    promises.push(service.hefeng.getLocationId(longitude, latitude))
    promises.push(service.lbsqq.getAddressByLocation(longitude, latitude))
    const [locationId, addressData] = await Promise.all(promises)
    const { adcode, province, city, district } = addressData.result.ad_info

    const row = { userId: ctx.userId, ip: ctx.ip, longitude, latitude, name, address, province, city, district, adcode, locationId }
    ctx.model.UserChooseLocation.create(row)

    ctx.body = { errcode: 0, errmsg: 'ok' }
  }
}

module.exports = LocationController
