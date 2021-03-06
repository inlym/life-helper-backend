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
   * 缓存和风天气 城市信息查询 接口数据
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   */
  KEY_HEFENG_LOCATION_PREFIX: 'hefeng:geo:',

  /**
   * 缓存和风天气 实时空气质量 接口数据
   * @see https://dev.qweather.com/docs/api/air/air-now/
   */
  KEY_HEFENG_AIRNOW_PREFIX: 'hefeng:airnow:',

  /**
   * 缓存和风天气 逐天天气预报（15天） 接口数据
   * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
   */
  KEY_HEFENG_15D_PREFIX: 'hefeng:15d:',
}
