import { Injectable } from '@nestjs/common'
import { lbsqq } from 'src/config'
import { IpLocationResult } from './location.interface'
import { RedisService } from 'nestjs-redis'
import jshttp from 'jshttp'

@Injectable()
export class LbsqqService {
  /** 开发者密钥获取次数 */
  private counter = 0

  constructor(private redisService: RedisService) {}

  /**
   * 获取 `腾讯位置服务` 的开发者密钥（`key`）
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
   */
  getKey(): string {
    const keys: string[] = lbsqq.keys
    const n: number = this.counter++ % keys.length
    return keys[n]
  }

  /**
   * IP 定位
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
   * @param {string} ip IP地址
   * @param {boolean} nocache 不使用缓存
   */
  async ipLocation(ip: string, nocache = false): Promise<IpLocationResult> {
    if (!ip) {
      // ip 为空也会请求成功（默认为请求者 ip），这里额外再加一层检验
      throw new Error('ip为空')
    }

    const redisKey = `lbsqq:location:ip:${ip}`
    const redis = this.redisService.getClient()

    if (!nocache) {
      const redisResult = await redis.get(redisKey)
      if (redisResult) {
        return JSON.parse(redisResult)
      }
    }

    const key: string = this.getKey()

    /** 请求参数 */
    const requestOptions = {
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      params: { ip, key },
    }

    const { data: resData } = await jshttp(requestOptions)
    if (!resData.status) {
      const result = resData.result
      const expiration = 3600 * 24 * 10
      await redis.set(redisKey, JSON.stringify(result), 'EX', expiration)
      return result
    } else {
      throw new Error(`[腾讯位置服务] [IP 定位] 接口请求失败，错误原因 => ${resData.message}`)
    }
  }
}
