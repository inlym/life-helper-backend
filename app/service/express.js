'use strict'

const { Service } = require('egg')

class ExpressService extends Service {
  async info(expressNumber) {
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

module.exports = ExpressService
