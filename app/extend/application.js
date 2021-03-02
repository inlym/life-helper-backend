'use strict'

const dayjs = require('dayjs')
const axios = require('axios')
const querystring = require('querystring')
const keys = require('../constant/keys.js')

module.exports = {
  /**
   * 以 2001-01-01 01:01:01 格式字符串返回当前时间
   */
  now() {
    return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },

  /**
   * 封装待缓存版本的请求，返回响应数据
   * @since 0.1.0
   * @param {object} requestOptions 请求参数
   * @param {object} cacheOptions 缓存相关参数
   * @param {boolean} [cacheOptions.disableCache=false] 强制不使用缓存而直接发送请求
   * @param {number} [cacheOptions.expiration=0] 存储缓存的有效期，单位：秒
   */
  async getData(requestOptions, cacheOptions = {}) {
    const { url, params = {} } = requestOptions
    const { disableCache, expiration = 0 } = cacheOptions

    const search = querystring.stringify(params) ? `?${querystring.stringify(params)}` : ''
    const hostpath = url.replace('https://', '').replace('http://', '')

    /** 在 Redis 中的键名 */
    const key = `${keys.KEY_HTTP_PREFIX}:${hostpath}${search}`

    if (!disableCache) {
      const cacheResult = await this.redis.get(key)
      if (cacheResult) {
        // 有缓存值，则直接返回
        return JSON.parse(cacheResult)
      }
    }

    const { data } = await axios(requestOptions)
    if (expiration) {
      this.redis.set(key, JSON.stringify(data), 'EX', expiration)
    }

    return data
  },
}
