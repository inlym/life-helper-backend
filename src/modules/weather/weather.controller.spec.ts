import { Test, TestingModule } from '@nestjs/testing'
import { WeatherController } from './weather.controller'

describe('WeatherController', () => {
  let controller: WeatherController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
    }).compile()

    controller = module.get<WeatherController>(WeatherController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
