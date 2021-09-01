import { Test, TestingModule } from '@nestjs/testing'
import {
  AirDailyForecastItem,
  AirNow,
  CityInfo,
  DailyForecastItem,
  HourlyForecastItem,
  LivingIndexItem,
  MinutelyRainItem,
  WarningCity,
  WarningNowItem,
  WeatherNow,
} from './hefeng-http.model'
import { HefengHttpService } from './hefeng-http.service'

describe('(class) HefengHttpService', () => {
  let service: HefengHttpService

  const testLocation = '120.137956,30.243928'
  const testLocationId = '101210113'

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HefengHttpService],
    }).compile()

    service = module.get<HefengHttpService>(HefengHttpService)
  })

  describe('(method) searchCity', () => {
    describe('使用 `上海` 作为关键词模糊匹配查询', () => {
      let result: CityInfo[]

      it('方法调用成功', async () => {
        result = await service.searchCity('上海')
        expect(result).toBeDefined()
      })

      it('列表大于 0 项', () => {
        expect(result.length).toBeGreaterThan(0)
      })

      it('列表第一项的名称为上海', () => {
        expect(result[0].name).toBe('上海')
      })

      it('列表第一项的 `id` 为 `101020100`', () => {
        expect(result[0].id).toBe('101020100')
      })
    })

    describe('使用一个指定的经纬度坐标查询', () => {
      let result: CityInfo[]

      it('方法调用成功', async () => {
        result = await service.searchCity(testLocation)
        expect(result).toBeDefined()
      })

      it('列表只有 1 项', () => {
        expect(result.length).toBe(1)
      })

      it('列表第 1 项的 `id` 为预期值', () => {
        expect(result[0].id).toBe(testLocationId)
      })
    })

    describe('使用 `LocationID` 坐标查询', () => {
      let result: CityInfo[]

      it('方法调用成功', async () => {
        result = await service.searchCity(testLocation)
        expect(result).toBeDefined()
      })

      it('列表只有 1 项', () => {
        expect(result.length).toBe(1)
      })

      it('列表第 1 项的 `id` 为预期值', () => {
        expect(result[0].id).toBe(testLocationId)
      })
    })
  })

  describe('(method) getTopCity', () => {
    describe('无参数调用', () => {
      let result: CityInfo[]

      it('方法调用成功', async () => {
        result = await service.getTopCity()
        expect(result).toBeDefined()
      })

      it('列表包含多项', () => {
        expect(result.length).toBeGreaterThan(1)
      })
    })
  })

  describe('(method) getWeatherNow', () => {
    const keys = [
      'obsTime',
      'temp',
      'feelsLike',
      'icon',
      'text',
      'wind360',
      'windDir',
      'windScale',
      'windSpeed',
      'humidity',
      'precip',
      'pressure',
      'vis',
      'cloud',
      'dew',
    ]

    describe('使用指定经纬度调用', () => {
      let result: WeatherNow

      it('方法调用成功', async () => {
        result = await service.getWeatherNow(testLocation)
        expect(result).toBeDefined()
      })

      it('包含所有指定属性', () => {
        keys.forEach((key: string) => {
          expect(result[key]).toBeDefined()
        })
      })
    })

    describe('使用 `LocationID` 调用', () => {
      let result: WeatherNow

      it('方法调用成功', async () => {
        result = await service.getWeatherNow(testLocationId)
        expect(result).toBeDefined()
      })

      it('包含所有指定属性', () => {
        keys.forEach((key: string) => {
          expect(result[key]).toBeDefined()
        })
      })
    })
  })

  describe('(method) getDailyForecast', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: DailyForecastItem[]

      it('方法调用成功', async () => {
        result = await service.getDailyForecast(testLocationId, 3)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getHourlyForecast', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: HourlyForecastItem[]

      it('方法调用成功', async () => {
        result = await service.getHourlyForecast(testLocationId, 24)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getLivingIndex', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: LivingIndexItem[]

      it('方法调用成功', async () => {
        result = await service.getLivingIndex(testLocationId)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getAirNow', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: AirNow

      it('方法调用成功', async () => {
        result = await service.getAirNow(testLocationId)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getAirDailyForecast', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: AirDailyForecastItem[]

      it('方法调用成功', async () => {
        result = await service.getAirDailyForecast(testLocationId)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getMinutelyRain', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: MinutelyRainItem[]

      it('方法调用成功', async () => {
        result = await service.getMinutelyRain(testLocation)
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getWarningCityList', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: WarningCity[]

      it('方法调用成功', async () => {
        result = await service.getWarningCityList()
        expect(result).toBeDefined()
      })
    })
  })

  describe('(method) getWarningNow', () => {
    describe('使用 `LocationID` 调用', () => {
      let result: WarningNowItem[]

      it('方法调用成功', async () => {
        result = await service.getWarningNow(testLocationId)
        expect(result).toBeDefined()
      })
    })
  })
})
