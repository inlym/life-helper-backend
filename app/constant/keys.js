'use strict'

/**
 * 存入 Redis 的键名，注意部分为完整键名，部分仅为键名前缀
 */
module.exports = {
  /**
   * HTTP 请求的响应结果缓存
   * @since 0.1.0
   * 键名完整格式：`${KEY_HTTP_PREFIX}:${url}`
   */
  KEY_HTTP_PREFIX: 'http_data',

  /**
   * 缓存和风天气城市信息查询接口数据
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   */
  KEY_HEFENG_LOCATION_PREFIX: 'hefeng:geo:',
}
