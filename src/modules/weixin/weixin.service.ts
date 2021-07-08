import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import jshttp from 'jshttp'
import { WeixinMiniProgramConfig } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { ERRORS } from 'src/common/errors.constant'
import { code2SessionInterface, fetchAccessTokenInterface } from './weixin.interface'

/** 小程序开发者 ID 和密钥 */
const { appid, secret } = WeixinMiniProgramConfig

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
      throw new HttpException(ERRORS.INVILID_CODE, HttpStatus.NOT_ACCEPTABLE)
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
  async fetchAccessToken(): Promise<fetchAccessTokenInterface> {
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

  /**
   * 更新在 Redis 中的微信 access_token
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async updateAccessTokenInRedis() {
    const redisKey = 'weixin:token'
    const redis = this.redisService.getClient()
    const { access_token: token, expires_in: expiration } = await this.fetchAccessToken()
    await redis.set(redisKey, token, 'EX', expiration)
  }
}
