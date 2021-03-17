'use strict'

const { Service } = require('egg')

/**
 * 当前文件用于封装 和风天气 相关 API
 * @see https://dev.qweather.com/docs/api/
 * @since 2021-03-10
 *
 * @description
 * - 当前文件的方法仅用于获取原始接口数据，增加缓存逻辑，不对数据本身做处理。
 * - 当前文件的处理逻辑实际上是重复的，可以再次封装，但实际上没多几行代码，为了后期拓展性，不做封装。
 * - 后续在 weather 文件调用方法，同时对数据处理和输出。
 */
class HefengService extends Service {
  /**
   * 获取和风天气内使用的城市的 Location ID
   * @since 2021-03-10
   * @see https://dev.qweather.com/docs/api/geo/city-lookup/
   * @returns {Promise<string>} locationId
   */
  async getLocationId(longitude, latitude) {
    const { app, service, logger } = this

    const lng = parseFloat(longitude, 10).toFixed(3)
    const lat = parseFloat(latitude, 10).toFixed(3)

    const { key: redisKey, timeout } = service.keys.hefengLocationId(lng, lat)

    // 先检查是否有缓存，若有则直接从缓存中获取并返回
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).location[0].id
    }
    const { key } = app.config.QWEATHER.basic
    const requestOptions = {
      url: 'https://geoapi.qweather.com/v2/city/lookup',
      params: {
        location: `${lng},${lat}`,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 城市信息查询, location=${lng},${lat}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.location[0].id
    } else {
      logger.error(`[接口请求错误] 和风天气 - 城市信息查询, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * （待废除）处理和风天气中使用的 location 参数
   * @since 2021-03-15
   * @param {string|object} location 地区的 LocationID 或以英文逗号分隔的经度,纬度坐标，或为包含经纬度的对象
   * @returns {string}
   *
   * @example
   * location 参数支持 3 种形式：
   * 1. locationId，例如：'101270120'
   * 2. 经纬度拼接，例如：'104.102,30.660'
   * 3. 经纬度对象，例如： {longitude: '104.102', latitude: '30.660'}
   */
  handleLocationParams(location) {
    if (!location) {
      throw new Error('location 为空')
    }

    /** 经纬度保留到小数点后的位数，，目前 2 位已经够了，误差 1.4km 内 */
    const decimal = 2

    if (typeof location === 'string') {
      if (location.indexOf(',') === -1) {
        return location
      } else {
        const [longitude, latitude] = location.split(',')
        const lng = parseFloat(longitude, 10).toFixed(decimal)
        const lat = parseFloat(latitude, 10).toFixed(decimal)
        return `${lng},${lat}`
      }
    } else if (typeof location === 'object') {
      const { longitude, latitude } = location
      const lng = parseFloat(longitude, 10).toFixed(decimal)
      const lat = parseFloat(latitude, 10).toFixed(decimal)
      return `${lng},${lat}`
    }
  }

  /**
   * 用于在控制器中，处理和风天气相关接口，输出可供 service/weather 直接使用的参数
   * @since 2021-03-17
   *
   * @tag [Controller]
   *
   * @description
   * type = 'id' => 输出结果为 locationId
   * type = 'location' => 输出结果为经纬度坐标拼接字符串
   *
   * 处理逻辑：
   * 1. 处理了 query.location 参数为空则由 IP 换取经纬度的逻辑。
   * 2. 使用经纬度调用和风天气 API 前，对经纬度做了取舍处理。
   */
  async handleControllerParams(type = 'id') {
    const { ctx, service } = this
    const { location } = ctx.query

    let longitude = ''
    let latitude = ''

    /** 经纬度保留到小数点后的位数，，目前 2 位已经够了，误差 1.4km 内 */
    const decimal = 2

    if (location) {
      const [lng, lat] = location.split(',')
      if (lng && lat) {
        longitude = lng
        latitude = lat
      }
    } else {
      const coord = await service.location.getCoordByIp(ctx.ip)
      longitude = coord.longitude
      latitude = coord.latitude
    }

    if (type === 'location') {
      longitude = parseFloat(longitude, 10).toFixed(decimal)
      latitude = parseFloat(latitude, 10).toFixed(decimal)
      return `${longitude},${latitude}`
    }

    if (type === 'id') {
      const id = await this.getLocationId(longitude, latitude)
      return id
    }
  }

  /**
   * 实时天气
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/weather/weather-now/
   * @param {string} location 地区的 LocationID 或以英文逗号分隔的经度,纬度坐标
   * @returns {Promise<object>}
   */
  async weatherNow(location) {
    const { app, service, logger } = this

    location = this.handleLocationParams(location)
    const { key: redisKey, timeout } = service.keys.hefengWeatherNow(location)

    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).now
    }

    const { key, baseURL } = app.config.QWEATHER.basic
    const requestOptions = {
      baseURL,
      url: '/weather/now',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 实时天气, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.now
    } else {
      logger.error(`[接口请求错误] 和风天气 - 实时天气, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取逐天天气预报（15 天）
   * @since 2021-03-11
   * @see https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
   */
  async fore15d(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)

    const { key: redisKey, timeout } = service.keys.hefengFore15d(location)

    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).daily
    }

    const { key, baseURL } = app.config.QWEATHER.pro
    const requestOptions = {
      baseURL,
      url: '/weather/15d',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 逐天天气预报（15天）, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.daily
    } else {
      logger.error(`[接口请求错误] 和风天气 - 逐天天气预报（15天）, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取逐小时天气预报（24 小时）
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/weather/weather-hourly-forecast/
   */
  async fore24h(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)

    const { key: redisKey, timeout } = service.keys.hefengFore24h(location)

    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).hourly
    }

    const { key, baseURL } = app.config.QWEATHER.basic
    const requestOptions = {
      baseURL,
      url: '/weather/24h',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 逐小时天气预报（24小时）, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.hourly
    } else {
      logger.error(`[接口请求错误] 和风天气 - 逐小时天气预报（24小时）, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取分钟级降水（未来 2 小时，间隔 5 分钟）
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/grid-weather/minutely/
   */
  async minutelyRain(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)
    const { key: redisKey, timeout } = service.keys.hefengMinutelyRain(location)
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult)
    }
    const { key, baseURL } = app.config.QWEATHER.pro
    const requestOptions = {
      baseURL,
      url: '/minutely/5m',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 分钟级降水, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData
    } else {
      logger.error(`[接口请求错误] 和风天气 - 分钟级降水, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取天气生活指数
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/indices/
   */
  async indices(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)
    const { key: redisKey, timeout } = service.keys.hefengIndices(location)
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).daily
    }
    const { key, baseURL } = app.config.QWEATHER.basic
    const requestOptions = {
      baseURL,
      url: '/indices/1d',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 天气生活指数, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.daily
    } else {
      logger.error(`[接口请求错误] 和风天气 - 天气生活指数, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取实时空气质量
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/air/air-now/
   */
  async airNow(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)
    const { key: redisKey, timeout } = service.keys.hefengAirNow(location)
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).now
    }
    const { key, baseURL } = app.config.QWEATHER.basic
    const requestOptions = {
      baseURL,
      url: '/air/now',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 实时空气质量, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.now
    } else {
      logger.error(`[接口请求错误] 和风天气 - 实时空气质量, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }

  /**
   * 获取空气质量预报
   * @since 2021-03-15
   * @see https://dev.qweather.com/docs/api/air/air-daily-forecast/
   */
  async air5d(location) {
    const { app, service, logger } = this
    location = this.handleLocationParams(location)
    const { key: redisKey, timeout } = service.keys.hefengAir5d(location)
    const cacheResult = await app.redis.get(redisKey)
    if (cacheResult) {
      return JSON.parse(cacheResult).daily
    }
    const { key, baseURL } = app.config.QWEATHER.pro
    const requestOptions = {
      baseURL,
      url: '/air/5d',
      params: {
        location,
        key,
      },
    }
    const { data: resData } = await app.axios(requestOptions)
    if (parseInt(resData.code, 10) === 200) {
      logger.debug(`[接口请求成功] 和风天气 - 空气质量预报（5天）, location=${location}`)
      app.redis.set(redisKey, JSON.stringify(resData), 'EX', timeout)
      return resData.daily
    } else {
      logger.error(`[接口请求错误] 和风天气 - 空气质量预报（5天）, 请求参数 params=${JSON.stringify(requestOptions.params)}, 响应 code=${resData.code}`)
    }
  }
}

module.exports = HefengService
