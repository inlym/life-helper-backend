'use strict'

const { Service } = require('egg')

class Api3rdService extends Service {
  /**
   * @typedef LocationInfo
   * @type {Object}
   * @property {string} en_short 英文简称
   * @property {string} en_name 国家英文名称
   * @property {string} nation 国家
   * @property {string} province 省份
   * @property {string} city 城市
   * @property {string} district 县区
   * @property {string} adcode 邮政编码
   * @property {number} lat 纬度
   * @property {number} lng 经度
   */

  /**
   * 通过 IP 换取定位信息
   * @see https://market.aliyun.com/products/57002002/cmapi00035184.html
   * @param {!string} ip
   * @returns {Promise<LocationInfo>}
   * @example
   * ```js
   * {"en_short":"CN","en_name":"China","nation":"中国","province":"浙江省","city":"杭州市","district":"西湖区","adcode":330106,"lat":30.25961,"lng":120.13026}
   * ```
   */
  async fetchLocation(ip) {
    const { app } = this
    const { APPCODE_IPLOCATION } = app.config
    const { axios } = app

    const request = {
      url: 'https://ips.market.alicloudapi.com/iplocaltion',
      method: 'GET',
      params: {
        ip: ip,
      },
      headers: {
        Authorization: `APPCODE ${APPCODE_IPLOCATION}`,
      },
    }

    const response = await axios(request)

    const SUCCESS_STATUS = 200
    const SUCCESS_CODE = 100

    if (response.status !== SUCCESS_STATUS) {
      return Promise.reject(new Error('第三方错误：HTTP状态码非200'))
    } else if (response.data.code !== SUCCESS_CODE) {
      return Promise.reject(new Error(`第三方错误：错误原因：${response.data.message}`))
    } else {
      return response.data.result
    }
  }

  async fetchExpressInfo(expressNumber) {
    if (!expressNumber || typeof expressNumber !== 'string') {
      throw new Error('参数错误: 快递单号(expressNumber)为空或非字符串')
    }

    const { app } = this
    const { APPCODE_EXPRESS } = app.config
    const { axios } = app

    const request = {
      url: 'http://wuliu.market.alicloudapi.com/kdi',
      method: 'GET',
      params: {
        no: expressNumber,
      },
      headers: {
        Authorization: `APPCODE ${APPCODE_EXPRESS}`,
      },
    }

    const response = await axios(request)

    const SUCCESS_STATUS = '0'
    if (response.data.status === SUCCESS_STATUS) {
      return response.data.result
    } else {
      app.logger.error(JSON.stringify(response.data))
      return Promise.reject(new Error(response.data.msg))
    }
  }
}

module.exports = Api3rdService
