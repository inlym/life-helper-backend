import { Controller, Get } from '@nestjs/common'

/**
 * 说明：
 * 1. 当前控制器不承载任何业务逻辑，仅用于特定路由的文本内容返回。
 */
@Controller()
export class AppController {
  /**
   * 访问根路由，展示对应文字，用于检测项目正常启动
   */
  @Get()
  getHello(): string {
    return 'Hello, inlym!'
  }
}
