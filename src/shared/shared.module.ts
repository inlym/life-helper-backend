/**
 * ╔═══════════════════════════   共享模块说明   ═══════════════════════════╗
 * ║                                                                      ║
 * ╟── 1. 存在跨模块使用的服务统一放置在共享模块下。                             ║
 * ╟── 2. 共享模块除了引入 MySQL、Redis 等资源服务外，不得引入任何特性模块。       ║
 * ╟── 3. 共享模块不要引入根模块，只被需要的特性模块引入。                        ║
 * ╟── 4. 共享模块所有服务均需要完整单元测试。                                  ║
 * ║                                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { Module } from '@nestjs/common'
import { LbsqqService } from './lbsqq/lbsqq.service'
import { WeixinService } from './weixin/weixin.service'

const services = [LbsqqService, WeixinService]

@Module({
  providers: services,
  exports: services,
})
export class SharedModule {}
