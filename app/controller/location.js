'use strict'

const { Controller } = require('egg')

class LocationController extends Controller {
  /**
   * @api {get} /location/address 获取所在位置地址描述
   * @apiName address
   * @apiGroup location
   * @apiVersion 0.0.3
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
      const {
        location: { lat, lng },
      } = await service.location.getLocationByIp(ctx.ip)

      latitude = lat
      longitude = lng
    }

    const result = await service.location.getAddressByLocation(longitude, latitude)

    ctx.body = {
      address: result.formatted_addresses.recommend,
    }
  }
}

module.exports = LocationController
