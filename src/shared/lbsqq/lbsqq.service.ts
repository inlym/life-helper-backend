/**
 * ╔═════════════════════════════   腾讯位置服务   ═════════════════════════════════
 * ║
 * ╟── 1. 封装对 腾讯位置服务 API 接口的调用
 * ╟── 2. 对调用接口结果再做一层封装，方便内部使用
 * ║
 * ╚════════════════════════════════════════════════════════════════════════
 */

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { Redis } from 'ioredis'
import { LbsqqKeys } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { GeoLocationCoderResponse, LocateIpResponse } from './lbsqq.interface'

@Injectable()
export class LbsqqService {
  private readonly logger = new Logger(LbsqqService.name)
  private readonly redis: Redis

  /** 开发者密钥获取次数，每一次获取密钥则 +1 */
  private counter = 0

  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient()
  }

  /**
   * 获取一个 `腾讯位置服务` 的开发者密钥（`key`）
   *
   * @description
   * 每个开发者密钥都有请求并发限制，预定义了一个密钥数组，按照数组索引逐个获取使用。
   * @see [接口配额说明](https://lbs.qq.com/service/webService/webServiceGuide/webServiceQuota)
   */
  getKey(): string {
    const keys: string[] = LbsqqKeys
    const n: number = this.counter++ % keys.length
    return keys[n]
  }

  /**
   * 通过 IP 地址进行非精确定位
   *
   * @param ip IP 地址
   *
   * @see [文档地址](https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp)
   */
  async locateIp(ip: string): Promise<LocateIpResponse> {
    if (!ip) {
      // IP 地址为空也会请求成功（默认为请求者 IP 地址，即当前服务器 IP），这里额外再加一层检验
      this.logger.error('使用 `LbsqqService.ipLocation` 方法时传入 `ip` 为空！')
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    /** Redis 键名 */
    const redisKey = `lbsqq:location:ip:${ip}`

    const result = await this.redis.get(redisKey)
    if (result) {
      return JSON.parse(result)
    }

    const key = this.getKey()
    const options = {
      url: 'https://apis.map.qq.com/ws/location/v1/ip',
      params: { ip, key },
    }
    const response = await axios.request<LocateIpResponse>(options)
    if (response.data.status !== 0) {
      this.logger.error(`[腾讯位置服务] [IP 定位] 接口请求失败，ip => \`${ip}\`，错误原因 => ${response.data.message}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    /** Redis 缓存时长：10 天 */
    const expiration = 3600 * 24 * 10
    this.redis.set(redisKey, JSON.stringify(response.data), 'EX', expiration)
    return response.data
  }

  /**
   * 逆地址解析，将经纬度转换为文字地址及相关位置信息
   *
   * @param longitude 经度
   * @param latitude 纬度
   *
   * @see [文档地址](https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder)
   */
  async geoLocationCoder(longitude: number, latitude: number): Promise<GeoLocationCoderResponse> {
    const redisKey = `lbsqq:address:location:${longitude},${latitude}`
    const result = await this.redis.get(redisKey)

    if (result) {
      return JSON.parse(result)
    }

    const key: string = this.getKey()

    /** 请求参数 */
    const options = {
      url: 'https://apis.map.qq.com/ws/geocoder/v1',
      params: { location: `${latitude},${longitude}`, key, get_poi: 0 },
    }

    const response = await axios.request<GeoLocationCoderResponse>(options)
    if (response.data.status !== 0) {
      this.logger.error(`[腾讯位置服务] [逆地址解析] 接口请求失败，params => \`${options.params}\`，错误原因 => ${response.data.message}`)
      throw new HttpException(COMMON_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    /** Redis 缓存时长：10 天 */
    const expiration = 3600 * 24 * 10
    this.redis.set(redisKey, JSON.stringify(response.data), 'EX', expiration)
    return response.data
  }
}
