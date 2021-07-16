import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import jshttp from 'jshttp'
import { WeixinMiniProgramConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR, WX_INVALID_CODE } from 'src/common/errors.constant'
import { code2SessionInterface, FetchAccessTokenResult, GetUnlimitedOptions } from './weixin.interface'

/** 小程序开发者 ID 和密钥 */
const { appid, secret } = WeixinMiniProgramConfig

/** 微信服务端接口调用凭证在 `Redis` 中存储的键名 */
const WX_TOKEN_KEY = 'weixin:token'

/**
 * 封装请求微信服务端相关方法
 */
@Injectable()
export class WeixinService {
  private readonly logger = new Logger(WeixinService.name)

  constructor(private redisService: RedisService) {}

  /**
   * 通过 code 换取 session 信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * @param {string} code 微信小程序端获取的临时登录凭证
   */
  async code2Session(code: string): Promise<code2SessionInterface> {
    const reqOptions = {
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: { appid, secret, js_code: code, grant_type: 'authorization_code' },
    }
    const { data: resData } = await jshttp(reqOptions)
    if (resData.errcode) {
      this.logger.error(`微信请求获取 openid 失败，code：\`${code}\`，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
      throw new HttpException(WX_INVALID_CODE, HttpStatus.NOT_ACCEPTABLE)
    } else {
      return resData
    }
  }

  /**
   * 对上述的 `code2Session` 方法做一层封装，增加缓存逻辑
   *
   * 针对以下微信要求所做的额外处理（配合前端也有改动）：
   * @see https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html
   */
  async getSession(code: string): Promise<code2SessionInterface> {
    const redisKey = `weixin:session:code:${code}`
    const redis = this.redisService.getClient()
    const redisResult = await redis.get(redisKey)
    if (redisResult) {
      return JSON.parse(redisResult)
    } else {
      const session = await this.code2Session(code)
      await redis.set(redisKey, JSON.stringify(session), 'EX', 3600 * 24 * 10)
      return session
    }
  }

  /**
   * 向微信服务端请求获取小程序全局唯一后台接口调用凭据（access_token）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
   */
  async fetchAccessToken(): Promise<FetchAccessTokenResult> {
    const options = {
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      params: { grant_type: 'client_credential', appid, secret },
    }
    const response = await jshttp(options)
    const resData: FetchAccessTokenResult = response.data
    if (resData.errcode) {
      this.logger.error(`调用微信获取 AccessToken 接口出错，错误码：${resData.errcode}，错误原因：${resData.errmsg}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    } else {
      return resData
    }
  }

  /**
   * 更新在 Redis 中的微信服务端接口调用凭证（不管当前是否有值）
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateAccessToken(): Promise<string> {
    const redisKey = WX_TOKEN_KEY
    const redis = this.redisService.getClient()

    const { access_token: token, expires_in: expiration } = await this.fetchAccessToken()
    await redis.set(redisKey, token, 'EX', expiration)
    return token
  }

  async getAccessToken(): Promise<string> {
    const redisKey = WX_TOKEN_KEY
    const redis = this.redisService.getClient()

    const result = await redis.get(redisKey)
    if (result) {
      return result
    } else {
      return await this.updateAccessToken()
    }
  }

  /**
   * 封装请求微信服务端接口请求（封装了处理获取 `access_token` 逻辑）
   */
  async wxWrappedRequest<T = any>(options: any): Promise<T> {
    const token = await this.getAccessToken()
    const params = options.params || {}
    params.access_token = token
    options.params = params

    const { data } = await jshttp(options)
    if (options.responseType === 'arraybuffer' || !data.errcode) {
      return data
    }

    // 发生错误情况，再重新获取 `access_token` 然后再请求一遍
    this.logger.warn(`请求微信服务端接口发生错误，请求参数 => ${JSON.stringify(options)}, errcode => ${data.errcode}, errmsg => ${data.errmsg}`)
    const token2 = await this.updateAccessToken()
    options.params.access_token = token2
    const { data: data2 } = await jshttp(options)
    if (options.responseType === 'arraybuffer' || !data2.errcode) {
      return data2
    }

    this.logger.warn(`请求微信服务端接口发生错误，请求参数 => ${JSON.stringify(options)}, errcode => ${data2.errcode}, errmsg => ${data2.errmsg}`)
    throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 获取微信小程序码（无数量限制）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
   */
  async getUnlimitedWxacode(config: GetUnlimitedOptions): Promise<Buffer> {
    const buf = await this.wxWrappedRequest<Buffer>({
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
      data: config,
      responseType: 'arraybuffer',
    })

    // 附加一层校验：响应数据小于 1KB，说明内容是文本字符内容，而不是小程序码图片
    if (buf.length < 1024) {
      const { errcode, errmsg } = JSON.parse(buf.toString())
      this.logger.error(`微信请求获取小程序码失败，config：\`${JSON.stringify(config)}\`，错误码：${errcode}，错误原因：${errmsg}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return buf
  }
}
