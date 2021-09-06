import { Module } from '@nestjs/common'
import { SystemController } from './system.controller'
import { SystemService } from './system.service'

/**
 * 系统信息模块
 *
 *
 * ### 模块定位
 *
 * ```markdown
 * 1. 用于查看系统运行状态和运行参数。
 * 2. 与业务完全无关，不涉及业务逻辑。
 * ```
 */
@Module({
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
