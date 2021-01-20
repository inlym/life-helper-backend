'use strict'

const { Service } = require('egg')

class Api3rdService extends Service {
  /**
   * 通过 IP 换取定位信息
   *
   * @see https://market.aliyun.com/products/57002002/cmapi00035184.html
   * @param {string} ip
   * @returns {Promise<object>}
   * @example 返回内容样例:
   * {"en_short":"CN","en_name":"China","nation":"中国","province":"浙江省","city":"杭州市","district":"西湖区","adcode":330106,"lat":30.25961,"lng":120.13026}
   */
  async getLocation(ip) {
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
}

module.exports = Api3rdService
