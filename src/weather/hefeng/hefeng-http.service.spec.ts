import { Test, TestingModule } from '@nestjs/testing'
import { CityInfo } from './hefeng-http.model'
import { HefengHttpService } from './hefeng-http.service'

describe('(class) HefengHttpService', () => {
  let service: HefengHttpService

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

      const location = '120.137913,30.243928'
      const expected = { id: '101210113' }

      it('方法调用成功', async () => {
        result = await service.searchCity(location)
        expect(result).toBeDefined()
      })

      it('列表只有 1 项', () => {
        expect(result.length).toBe(1)
      })

      it('列表第 1 项的 `id` 为预期值', () => {
        expect(result[0].id).toBe(expected.id)
      })
    })

    describe('使用 `LocationID` 坐标查询', async () => {
      let result: CityInfo[]

      const location = '101210113'
      const expected = { id: '101210113' }

      it('方法调用成功', async () => {
        result = await service.searchCity(location)
        expect(result).toBeDefined()
      })

      it('列表只有 1 项', () => {
        expect(result.length).toBe(1)
      })

      it('列表第 1 项的 `id` 为预期值', () => {
        expect(result[0].id).toBe(expected.id)
      })
    })
  })

  describe('(method) getTopCity', () => {
    describe('正常调用', () => {
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
})
