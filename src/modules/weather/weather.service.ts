import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { HefengService } from './hefeng.service'
import { WeatherCityService } from './weather-city.service'
import { LocationService } from '../location/location.service'
import { WeatherNow, MinutelyRain } from './weather.dto'

@Injectable()
export class WeatherService {
  constructor(private hefengService: HefengService, private weatherCityService: WeatherCityService, private locationService: LocationService) {}

  async getWeather(userId: number, ip: string, cityId?: number) {
    const cities = await this.weatherCityService.getAll(userId)

    if (cities.length === 0) {
      const { longitude, latitude } = await this.locationService.getLocationByIp(ip)
      const locationId = await this.hefengService.getLocationId(longitude, latitude)
      const result = await this.mergeWeatherInfo(locationId, longitude, latitude)
      return Object.assign({}, { cities }, result)
    } else {
      let city = cities[0]
      if (cityId) {
        const city2 = cities.find((item) => item.id === cityId)
        if (city2) {
          city = city2
        }
      }
      const { locationId, longitude, latitude } = city
      const result = await this.mergeWeatherInfo(locationId, longitude, latitude)
      return Object.assign({}, { cities }, result)
    }
  }

  async mergeWeatherInfo(locationId: string, longitude: number, latitude: number) {
    const promises = []
    promises.push(this.getWeatherNow(locationId))
    promises.push(this.getWeather15d(locationId))
    promises.push(this.getWeather24h(locationId))
    promises.push(this.getAirNow(locationId))
    promises.push(this.getAir5d(locationId))
    promises.push(this.getRain(longitude, latitude))
    const [now, f15d, f24h, airnow, air5d, rain] = await Promise.all(promises)
    return { now, f15d, f24h, airnow, air5d, rain }
  }

  async getWeatherNow(locationId: string): Promise<WeatherNow> {
    const result = await this.hefengService.getData('weather-now', locationId)
    return plainToClass(WeatherNow, result.now, { excludeExtraneousValues: true })
  }

  async getWeather15d(locationId: string) {
    const result = await this.hefengService.getData('weather-15d', locationId)
    return result.daily
  }

  async getWeather24h(locationId: string) {
    const result = await this.hefengService.getData('weather-24h', locationId)
    return result.hourly
  }

  async getAirNow(locationId: string) {
    const result = await this.hefengService.getData('air-now', locationId)
    return result.now
  }

  async getAir5d(locationId: string) {
    const result = await this.hefengService.getData('air-5d', locationId)
    return result.daily
  }

  async getRain(longitude: number, latitude: number): Promise<MinutelyRain> {
    const lng = longitude.toFixed(2)
    const lat = latitude.toFixed(2)
    const location = `${lng},${lat}`
    const result = await this.hefengService.getData('minutely-5m', location)
    return plainToClass(MinutelyRain, result, { excludeExtraneousValues: true })
  }
}
