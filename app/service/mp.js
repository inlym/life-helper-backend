'use strict'

const { Service } = require('egg')

const code2SessionUrl = 'https://api.weixin.qq.com/sns/jscode2session'
const getAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'

class MpService extends Service {
  /**
   * 通过 code 换取 session 信息
   * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html 微信小程序开发文档 }
   * @param {!string} code - 微信小程序端获取的临时登录凭证
   * @returns {Promise<mpSession>} 微信请求返回的数据
   *
   * @typedef {Object} mpSession
   * @property {string} session_key - 会话密钥
   * @property {string} openid - 用户唯一标识
   *
   * @example 返回内容样例:
   * {session_key:"xxxxxx",openid:"xxxxxx"}
   */
  async code2Session(code) {
    const { appid, secret } = this.app.config.miniprogram
    const url = `${code2SessionUrl}?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    })
    return res.data
  }

  async code2Openid(code) {
    const { openid } = await this.code2Session(code)
    return openid
  }

  /**
   * 获取小程序全局唯一后台接口调用凭据（access_token）
   */
  async getAccessToken() {
    const { appid, secret } = this.app.config.miniprogram
    const url = `${getAccessTokenUrl}?grant_type=client_credential&appid=${appid}&secret=${secret}`
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    })
    return res.data
  }
}

module.exports = MpService
