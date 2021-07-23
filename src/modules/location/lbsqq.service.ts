/**
 * ╔═════════════════════════════   说明   ═════════════════════════════════
 * ║
 * ╟── 1. 当前服务（`LbsqqService`）仅用于处理以下事项：
 * ║       - 封装对腾讯位置服务的请求
 * ║       - 对请求数据附加缓存逻辑
 * ╟── 2. 当前服务不对返回结果做任何数据处理
 * ║
 * ╚════════════════════════════════════════════════════════════════════════
 */

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { Redis } from 'ioredis'
import { LbsqqKeys } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { GeoLocationCoderResult, IpLocationResult } from './location.interface'

@Injectable()
export class LbsqqService {
  private readonly logger = new Logger(LbsqqService.name)
  private readonly redis: Redis

  /** 开发者密钥获取次数 */
  private counter = 0

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 获取 `腾讯位置服务` 的开发者密钥（`key`）
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
   *
   * @description
   * 每个开发者密钥都有请求并发限制，预定义了一个密钥数组，按照数组索引逐个获取使用。
   */
  getKey(): string {
    const keys: string[] = LbsqqKeys
    const n: number = this.counter++ % keys.length
    return keys[n]
  }

  /**
   * IP 定位
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
   * @param {string} ip IP地址
   */
  async ipLocation(ip: string): Promise<IpLocationResult> {
    if (!ip) {
      // ip 为空也会请求成功（默认为请求者 ip），这里额外再加一层检验
      this.logger.error('使用 `LbsqqService.ipLocation` 方法时传入 `ip` 为空！')
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const redisKey = `lbsqq:location:ip:${ip}`
    const redisResult = await this.redis.get(redisKey)

    if (redisResult) {
      return JSON.parse(redisResult)
    }

    const key: string = this.getKey()

    /** 请求参数 */
    const options = {
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      params: { ip, key },
    }

    const { data: resData } = await axios(options)
    if (!resData.status) {
      const result = resData.result
      const expiration = 3600 * 24 * 10
      await this.redis.set(redisKey, JSON.stringify(result), 'EX', expiration)
      return result
    } else {
      this.logger.error(`[腾讯位置服务] [IP 定位] 接口请求失败，ip => \`${ip}\`，错误原因 => ${resData.message}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * 转换经纬度为文字地址及相关位置信息
   * @param longitude 经度
   * @param latitude 纬度
   */
  async geoLocationCoder(longitude: number, latitude: number): Promise<GeoLocationCoderResult> {
    const redisKey = `lbsqq:address:location:${longitude},${latitude}`
    const redisResult = await this.redis.get(redisKey)

    if (redisResult) {
      return JSON.parse(redisResult)
    }

    const key: string = this.getKey()

    /** 请求参数 */
    const options = {
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      params: { location: `${latitude},${longitude}`, key, get_poi: 0 },
    }

    const { data: resData } = await axios(options)
    if (!resData.status) {
      const result = resData.result
      const expiration = 3600 * 24 * 10
      await this.redis.set(redisKey, JSON.stringify(result), 'EX', expiration)
      return result
    } else {
      this.logger.error(`[腾讯位置服务] [逆地址解析] 接口请求失败，错误原因 => ${resData.message}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
