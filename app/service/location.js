'use strict'

const { Service } = require('egg')

class LocationService extends Service {
  /**
   * 通过 IP 地址获取经纬度坐标
   * @param {string} ip IP地址
   */
  async getCoordByIp(ip) {
    const { service } = this
    const res = await service.lbsqq.getLocationByIp(ip)
    const { lng, lat } = res.result.location
    return { longitude: lng, latitude: lat }
  }

  /**
   * 根据经纬度获取所在地的地址描述
   * @since 2021-03-13
   * @param {string} longitude 经度
   * @param {string} latitude 纬度
   * @returns {string} 格式化地址文本
   */
  async getFormattedAddress(longitude, latitude) {
    const { service } = this
    const res = await service.lbsqq.getAddressByLocation(longitude, latitude)
    return res.result.formatted_addresses.recommend
  }
}

module.exports = LocationService
