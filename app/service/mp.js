'use strict'

const { Service } = require('egg')
const querystring = require('querystring')
const axios = require('axios')

class MpService extends Service {
  /**
   * 通过 code 换取 session 信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {string} code 微信小程序端获取的临时登录凭证
   * @return {Promise<{session_key:string;openid:string}>} 微信请求返回的数据
   * @example 返回内容样例:
   * {session_key:"xxxxxx",openid:"xxxxxx"}
   * @update 2021-02-06, 2021-04-08
   */
  async code2Session(code) {
    const { ctx, config } = this
    const { appid, secret } = config.miniprogram
    const reqOptions = {
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: { appid, secret, js_code: code, grant_type: 'authorization_code' },
    }
    const { data: resData } = await axios(reqOptions)
    if (resData.errcode) {
      throw new Error(`微信请求获取 openid 失败，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
    } else {
      ctx.state.wxSession = resData
      return resData
    }
  }

  /**
   * 封装向微信服务器的请求，自动处理 access_token 逻辑
   * @param {object} options 请求参数
   * @since 2021-04-09
   */
  async wxRequest(options) {
    const { logger } = this
    const token = await this.getAccessToken()
    options.params = options.params || {}
    options.params.access_token = token
    const { data: resData } = await axios(options)
    if (!resData.errcode) {
      return resData
    } else if (resData.errmsg && resData.errmsg.indexOf('access_token') !== -1) {
      logger.debug('微信 access_token 无效，准备再次发起请求！')
      const tokenNew = await this.updateAccessToken()
      options.params.access_token = tokenNew
      const { data: resData2 } = await axios(options)
      if (!resData2.errcode) {
        return resData2
      } else {
        throw new Error(`微信请求失败，错误码：${resData2.errcode}，错误原因：${resData2.errmsg}`)
      }
    } else {
      throw new Error(`微信请求失败，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
    }
  }

  /**
   * 通过 code 换取 openid
   * @param {!string} code - 微信小程序端获取的临时登录凭证
   * @return {Promise<string>}
   */
  async code2Openid(code) {
    const { openid } = await this.code2Session(code)
    return openid
  }

  /**
   * 向微信服务端请求获取小程序全局唯一后台接口调用凭据（access_token）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
   * @return {Promise<{access_token:string;expires_in:number}>}
   */
  async fetchAccessToken() {
    const { config } = this
    const { appid, secret } = config.miniprogram
    const reqOptions = {
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: { grant_type: 'client_credential', appid, secret },
    }
    const { data: resData } = await axios(reqOptions)
    if (resData.errcode) {
      throw new Error(`调用微信获取 AccessToken 接口出错，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
    } else {
      return resData
    }
  }

  /**
   * 用于本地调用获取小程序 access_token
   * @since 2021-03-26
   */
  async getAccessToken() {
    const { app, service } = this
    const { key: redisKey, timeout } = service.keys.wxAccessToken()
    const redisRes = await app.redis.get(redisKey)
    if (redisRes) {
      return redisRes
    }
    const { access_token } = await this.fetchAccessToken()
    await app.redis.set(redisKey, access_token, 'EX', timeout)
    return access_token
  }

  /**
   * 更新 Redis 中的微信调用凭证（access_token）
   */
  async updateAccessToken() {
    const { app, service } = this
    const { access_token } = await this.fetchAccessToken()
    const { key, timeout } = service.keys.wxAccessToken()
    await app.redis.set(key, access_token, 'EX', timeout)
    return access_token
  }

  /**
   * 生成小程序码
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
   * @param {object} opt 配置项
   */
  async getUnlimitedQRCode(opt) {
    const page = opt.path || 'pages/index/index'
    const query = opt.query || opt.params || {}
    const scene = querystring.encode(query)

    const token = await this.getAccessToken()

    const requestOptions = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      params: { access_token: token },
      data: { scene, page, auto_color: true },
      responseType: 'arraybuffer',
    }
    const response = await axios(requestOptions)
    if (parseInt(response.headers['content-length'], 10) < 1000) {
      // 响应体太小说明出错了，没有传回图片
      const resData = JSON.parse(response.data.toString())
      throw new Error(`调用微信获取小程序码接口出错，错误码 ${resData.errcode}, 错误信息 ${resData.errmsg}`)
    }
    return response.data
  }

  /**
   * 获取小程序码后转储到 OSS，返回 url 地址
   * @since 2021-03-26
   */
  async getUnlimitedQRCodeUrl(opt) {
    const { app, config } = this
    const buf = await this.getUnlimitedQRCode(opt)
    const oss = app.oss.get('img')
    const name = app.str32()
    const baseURL = config.domain.ossImageUgc
    const result = await oss.put(name + '.png', buf)
    console.log(result)
    return baseURL + '/' + result.name
  }
}

module.exports = MpService
