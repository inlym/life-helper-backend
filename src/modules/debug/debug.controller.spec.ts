import { Test, TestingModule } from '@nestjs/testing'
import { DebugController } from './debug.controller'

describe('DebugController', () => {
  let controller: DebugController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebugController],
    }).compile()

    controller = module.get<DebugController>(DebugController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('查看 `NODE_ENV`', () => {
    console.log('NODE_ENV: ', process.env.NODE_ENV)
  })
})
