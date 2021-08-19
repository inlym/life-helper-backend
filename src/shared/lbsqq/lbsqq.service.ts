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
import { plainToClass } from 'class-transformer'
import { Redis } from 'ioredis'
import { LbsqqKeys } from 'life-helper-config'
import { RedisService } from 'nestjs-redis'
import { COMMON_SERVER_ERROR } from 'src/common/errors.constant'
import { OssService } from '../oss/oss.service'
import { GeoLocationCoderResponse, LocateIpResponse, LocationCoordinate } from './lbsqq.interface'
import { AddressInfo } from './lbsqq.model'

@Injectable()
export class LbsqqService {
  private readonly logger = new Logger(LbsqqService.name)
  private readonly redis: Redis

  /** 开发者密钥获取次数，每一次获取密钥则 +1 */
  private counter = 0

  constructor(private redisService: RedisService, private readonly ossService: OssService) {
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

  /**
   * 根据经纬度生成静态地图，并返回存储路径
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async generateStaticMap(longitude: number, latitude: number): Promise<string> {
    /** 地图视图中心点 */
    const center = `${latitude},${longitude}`

    /** 地图视图的级别设置，取值范围 4≤zoom≤18 */
    const zoom = 12

    /** 地图静态图片大小，宽*高，单位像素 */
    const size = '600*400'

    /** 是否高清，取值2为高清，取值1为普清 */
    const scale = 1

    const markers = center

    const key = this.getKey()

    const response = await axios.request({
      method: 'GET',
      url: 'https://apis.map.qq.com/ws/staticmap/v2',
      params: { center, zoom, size, scale, markers, key },
      responseType: 'arraybuffer',
    })

    const contentType = response.headers['Content-Type'] || response.headers['content-type'] || 'image/png'

    const buf = response.data
    const path = await this.ossService.save('staticmap', buf, { headers: { 'Content-Type': contentType } })

    return path
  }

  /** ═════════════════  以下方法为对原生方法的二次封装方法  ═════════════════ */

  /**
   * 通过 IP 地址获取经纬度坐标
   *
   * @param ip IP 地址
   */
  async getCoordinateByIp(ip: string): Promise<LocationCoordinate> {
    const result = await this.locateIp(ip)
    const coord = result.result.location
    return { longitude: coord.lng, latitude: coord.lat }
  }

  /**
   * 通过经纬度获取对应地点的一句话描述
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getRecommendAddressDescrption(longitude: number, latitude: number): Promise<string> {
    const result = await this.geoLocationCoder(longitude, latitude)
    return result.result.formatted_addresses.recommend
  }

  /**
   * 通过经纬度获取省市区等行政区划信息
   *
   * @param longitude 经度
   * @param latitude 纬度
   */
  async getAddressInfo(longitude: number, latitude: number): Promise<AddressInfo> {
    const result = await this.geoLocationCoder(longitude, latitude)
    return plainToClass(AddressInfo, result.result.ad_info)
  }

  /**
   * 获取静态地图的完整 URL
   *
   * @param longitude 经度
   * @param latitude 纬度
   * @return 静态地图的完整 URL，例如：`https://res.lifehelper.com.cn/staticmap/xxxxxx`
   */
  async getStaticMapUrl(longitude: number, latitude: number): Promise<string> {
    const key = await this.generateStaticMap(longitude, latitude)
    const url = this.ossService.getUrl(key)
    return url
  }
}
