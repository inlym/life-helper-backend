import { Injectable } from '@nestjs/common'
import jshttp from 'jshttp'
import { code2SessionInterface } from './weixin.interface'
import { WeixinOptions } from 'src/config'

/** 小程序开发者 ID 和密钥 */
const { appid, secret } = WeixinOptions

/**
 * 封装请求微信服务端相关方法
 */
@Injectable()
export class WeixinService {
  /**
   * 通过 code 换取 session 信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {string} code 微信小程序端获取的临时登录凭证
   * @return {Promise<{session_key:string;openid:string}>} 微信请求返回的数据
   * @example 返回内容样例:
   * {session_key:"xxxxxx",openid:"xxxxxx"}
   */
  async code2Session(code): Promise<code2SessionInterface> {
    const reqOptions = {
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: { appid, secret, js_code: code, grant_type: 'authorization_code' },
    }
    const { data: resData } = await jshttp(reqOptions)
    if (resData.errcode) {
      throw new Error(`微信请求获取 openid 失败，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
    } else {
      return resData
    }
  }

  /**
   * 向微信服务端请求获取小程序全局唯一后台接口调用凭据（access_token）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
   * @return {Promise<{access_token:string;expires_in:number}>}
   */
  private async fetchAccessToken() {
    const reqOptions = {
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: { grant_type: 'client_credential', appid, secret },
    }
    const { data: resData } = await jshttp(reqOptions)
    if (resData.errcode) {
      throw new Error(`调用微信获取 AccessToken 接口出错，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
    } else {
      return resData
    }
  }
}
