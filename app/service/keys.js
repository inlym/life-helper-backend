'use strict'

const { Service } = require('egg')

/**
 * 当前文件用于处理在 Redis 中存储的键名（key）逻辑
 *
 * ```
 * 键名规则：
 * 如果 key 为 ttt:xxx:yyy:zzz => value
 * - zzz 为变量（可能为空）
 * - yyy 是 zzz 的变量名（可能为空）
 * - xxx 是 value 的变量名
 * - ttt 是 xxx 的上级分类
 *
 * 例如 userid=123, token=abcdefg 缓存需要通过 token 查询 userid，那么
 * key   => auth:userid:token:abcdefg
 * value => 123
 * ```
 *
 * 1. Redis 仅用作缓存用途，在存储时须做好随时 flushdb 的准备
 * 2. 键名一律小写，变量单词间下划线（_）
 * 3. 变量名间使用冒号（:）分隔
 */
class KeysService extends Service {
  /**
   * 存储从微信服务器获取的小程序全局唯一后台接口调用凭据（access_token）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
   */
  wxAccessToken() {
    return { key: 'weixin:access_token', timeout: 7200 }
  }

  /**
   * 存储请求详情
   * @param {requestId} id 请求 ID
   * @returns
   */
  requestLog(id) {
    return { key: `request:${id}`, timeout: 600 }
  }

  /**
   * 通过 token 换取 userId
   */
  token2UserId(token) {
    return { key: `auth:userid:token:${token}`, timeout: 3600 * 24 }
  }

  /**
   * 腾讯位置服务 IP定位 接口响应数据
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
   */
  lbsqqIp2Location(ip) {
    return { key: `lbsqq:location:ip:${ip}`, timeout: 3600 * 24 * 10 }
  }

  lbsqqLocation2Address(longitude, latitude) {
    return { key: `lbsqq:address:location:${longitude},${latitude}`, timeout: 3600 * 24 * 10 }
  }

  /**
   * [和风天气] [城市信息查询] 接口响应数据
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   */
  hefengLocationId(longitude, latitude) {
    return { key: `hefeng:id:location:${longitude},${latitude}`, timeout: 3600 * 24 * 10 }
  }

  /**
   * [和风天气] [逐天天气预报] [7d] 接口响应数据
   * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
   */
  hefengFore7d(location) {
    const timeout = 3600 * 4
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:7d:id:${location}`, timeout }
    } else {
      return { key: `hefeng:7d:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [逐天天气预报] [15d] 接口响应数据
   * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
   */
  hefengFore15d(location) {
    const timeout = 3600 * 4
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:15d:id:${location}`, timeout }
    } else {
      return { key: `hefeng:15d:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [逐小时天气预报] [24h] 接口响应数据
   * @see https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
   */
  hefengFore24h(location) {
    const timeout = 600
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:24h:id:${location}`, timeout }
    } else {
      return { key: `hefeng:24h:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [实时天气] 接口响应数据
   * @see https://dev.qweather.com/docs/api/weather/weather-now/
   */
  hefengWeatherNow(location) {
    const timeout = 1800
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:now:id:${location}`, timeout }
    } else {
      return { key: `hefeng:now:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [分钟级降水] [5m] 接口响应数据
   * @see https://dev.qweather.com/docs/api/weather/weather-now/
   */
  hefengMinutelyRain(location) {
    const timeout = 600
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:rain:id:${location}`, timeout }
    } else {
      return { key: `hefeng:rain:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [天气生活指数] [1d] 接口响应数据
   * @see https://dev.qweather.com/docs/api/indices/
   */
  hefengIndices(location) {
    const timeout = 1800
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:indices:id:${location}`, timeout }
    } else {
      return { key: `hefeng:indices:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [实时空气质量] 接口响应数据
   * @see https://dev.qweather.com/docs/api/air/air-now/
   */
  hefengAirNow(location) {
    const timeout = 600
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:airnow:id:${location}`, timeout }
    } else {
      return { key: `hefeng:airnow:location:${location}`, timeout }
    }
  }

  /**
   * [和风天气] [空气质量预报] [5d] 接口响应数据
   * @see https://dev.qweather.com/docs/api/air/air-daily-forecast/
   */
  hefengAir5d(location) {
    const timeout = 3600 * 4
    if (location.indexOf(',') === -1) {
      return { key: `hefeng:air5d:id:${location}`, timeout }
    } else {
      return { key: `hefeng:air5d:location:${location}`, timeout }
    }
  }
}

module.exports = KeysService
