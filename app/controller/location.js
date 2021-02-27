'use strict'

const { Controller } = require('egg')

class LocationController extends Controller {
  /**
   * 获取所在位置地址描述
   * @since 2021-02-27
   * 接口说明：
   * 1. 如果提供经纬度，则使用，否则从请求者 IP 地址换取经纬度
   * 2. 使用腾讯逆地址解析服务，将经纬度转换为地址描述
   *
   * method   =>    GET
   * path     =>    /location/address
   * query    =>    1. latitude - 纬度 - 可选
   *                2. longitude - 经度 - 可选
   */
  async address() {
    const { ctx, service } = this
    let { latitude, longitude } = ctx.query

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
