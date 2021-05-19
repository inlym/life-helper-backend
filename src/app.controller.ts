import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    const message = 'Life Helper Backend Project is Running!'
    return message
  }
}
