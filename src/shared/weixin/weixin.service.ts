import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios, { AxiosRequestConfig } from 'axios'
import { Redis } from 'ioredis'
import { WeixinMiniProgramConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR, WX_INVALID_CODE } from 'src/common/errors.constant'
import { BasicWeixinResponse, Code2SessionResponse, GetAccessTokenResponse, GetUnlimitedConfig } from './weixin.interface'

/** 小程序开发者 ID 和密钥 */
const { appid, secret } = WeixinMiniProgramConfig

@Injectable()
export class WeixinService {
  private readonly logger = new Logger(WeixinService.name)
  private readonly redis: Redis

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 通过 code 换取 session 信息
   *
   * @param code 微信小程序端获取的临时登录凭证
   *
   * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)
   *
   * @description
   * 该接口需要缓存的原因：微信小程序端对获取 `code` 存在限制，缓存了获取的 `code`，此处不加缓存，
   * 去微信服务端换取 session 信息会报 `code` 已使用的错误。
   */
  async code2Session(code: string): Promise<Code2SessionResponse> {
    const redisKey = `weixin:session:code:${code}`
    const result = await this.redis.get(redisKey)
    if (result) {
      return JSON.parse(result)
    }

    const response = await axios.request<Code2SessionResponse>({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: { appid, secret, js_code: code, grant_type: 'authorization_code' },
    })
    if (response.data.errcode) {
      this.logger.error(`[微信服务端 API] [auth.code2Session] 调用失败，code：\`${code}\`，错误码：${response.data.errcode}，错误原因：${response.data.errmsg}`)
      throw new HttpException(WX_INVALID_CODE, HttpStatus.NOT_ACCEPTABLE)
    }

    /** Redis 缓存时长：10 天 */
    const expiration = 3600 * 24 * 10
    this.redis.set(redisKey, JSON.stringify(response.data), 'EX', expiration)

    return response.data
  }

  /**
   * 获取小程序全局唯一后台接口调用凭据（access_token）
   *
   * @param forceUpdate 是否强制更新（即不从 Redis 获取）
   *
   * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)
   */
  async getAccessToken(forceUpdate = false): Promise<string> {
    const redisKey = 'weixin:token'

    if (!forceUpdate) {
      const result = await this.redis.get(redisKey)
      if (result) {
        return result
      }
    }

    const response = await axios.request<GetAccessTokenResponse>({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: { grant_type: 'client_credential', appid, secret },
    })
    if (response.data.errcode) {
      this.logger.error(`[微信服务端 API] [auth.getAccessToken] 调用失败，错误码：${response.data.errcode}，错误原因：${response.data.errmsg}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    this.redis.set(redisKey, response.data.access_token, 'EX', response.data.expires_in)
    return response.data.access_token
  }

  /**
   * 封装好获取微信服务端凭证的请求接口
   *
   * @param options 请求配置
   *
   * @description
   * 注意：非文本请求不要使用当前方法
   */
  async request<T extends BasicWeixinResponse>(options: AxiosRequestConfig) {
    const token = await this.getAccessToken()
    const params = options.params || {}
    params.access_token = token
    options.params = params

    const response = await axios.request<T>(options)
    if (!response.data.errcode) {
      return response.data
    }

    this.logger.error(`[微信服务端 API] 调用失败，错误码：${response.data.errcode}，错误原因：${response.data.errmsg}`)

    // 第一次没有成功，重新获取 token，然后再试一遍
    const refreshedToken = await await this.getAccessToken(true)
    options.params.access_token = refreshedToken

    const response2 = await axios.request<T>(options)
    if (!response2.data.errcode) {
      return response2.data
    }

    this.logger.error(`[微信服务端 API] 调用失败，错误码：${response2.data.errcode}，错误原因：${response2.data.errmsg}`)
    throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 获取无数量限制的小程序码
   *
   * @param config 配置内容
   *
   * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html)
   */
  async getUnlimitedWxacode(config: GetUnlimitedConfig): Promise<Buffer> {
    const token = await this.getAccessToken()

    const options: AxiosRequestConfig = {
      params: { access_token: token },
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      data: config,
      responseType: 'arraybuffer',
    }

    const response = await axios.request<Buffer>(options)

    // 附加一层校验：响应数据小于 1KB，说明内容是文本字符内容，而不是小程序码图片
    if (response.data.length > 1024) {
      return response.data
    }

    // 小于 1KB情况
    const { errcode, errmsg } = JSON.parse(response.data.toString()) as BasicWeixinResponse
    this.logger.error(`微信请求获取小程序码失败，config：\`${JSON.stringify(config)}\`，错误码：${errcode}，错误原因：${errmsg}`)

    // 先刷新 token，然后再请求一次
    const token2 = await this.getAccessToken(true)
    options.params = { access_token: token2 }

    const response2 = await axios.request<Buffer>(options)
    if (response2.data.length > 1024) {
      return response2.data
    }

    const { errcode: errcode2, errmsg: errmsg2 } = JSON.parse(response2.data.toString())
    this.logger.error(`微信请求获取小程序码失败，config：\`${JSON.stringify(config)}\`，错误码：${errcode2}，错误原因：${errmsg2}`)
    throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /** ═════════════════  以下方法为对原生方法的二次封装方法  ═════════════════ */
}
