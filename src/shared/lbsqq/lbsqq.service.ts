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
import { LocateIpResponse } from './lbsqq.interface'

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
}
