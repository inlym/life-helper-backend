'use strict'

const { Service } = require('egg')

const code2SessionUrl = 'https://api.weixin.qq.com/sns/jscode2session'
const getAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'

class MpService extends Service {
  /**
   * 通过 code 换取 session 信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {!string} code 微信小程序端获取的临时登录凭证
   * @returns {Promise<{session_key:string;openid:string}>} 微信请求返回的数据
   * @example 返回内容样例:
   * {session_key:"xxxxxx",openid:"xxxxxx"}
   * @update 2021-02-06
   */
  async code2Session(code) {
    const { appid, secret } = this.app.config.miniprogram
    const url = `${code2SessionUrl}?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    })
    this.logger.info(
      `[WEIXIN API] 从微信服务器使用 code 换取 session -> code => ${code} / session => ${JSON.stringify(res.data)}`
    )
    return res.data
  }

  /**
   * 通过 code 换取 openid
   * @param {!string} code - 微信小程序端获取的临时登录凭证
   * @returns {Promise<string>}
   */
  async code2Openid(code) {
    const { openid } = await this.code2Session(code)
    return openid
  }

  /**
   * 获取小程序全局唯一后台接口调用凭据（access_token）
   * @returns {Promise<{access_token:string;expires_in:number}>}
   */
  async getAccessToken() {
    const { appid, secret } = this.app.config.miniprogram
    const url = `${getAccessTokenUrl}?grant_type=client_credential&appid=${appid}&secret=${secret}`
    const res = await this.ctx.curl(url, {
      dataType: 'json',
    })
    this.logger.info(`[WEIXIN API] 获取小程序全局唯一后台接口调用凭据 -> access_token => ${res.data.access_token}`)
    return res.data
  }

  /**
   * 更新 Redis 中的微信调用凭证（access_token）
   * [schedule]
   *
   */
  async updateAccessToken() {
    const { access_token, expires_in } = await this.getAccessToken()
    this.app.redis.set('system@mpToken', access_token, 'EX', expires_in)
  }
}

module.exports = MpService
