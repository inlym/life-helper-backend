import { Injectable } from '@nestjs/common'

@Injectable()
export class LoggerService {
  debug(content) {
    console.log(content)
  }

  info(content) {
    console.info(content)
  }

  warn(content) {
    console.warn(content)
  }

  error(content) {
    console.error(content)
  }
}
