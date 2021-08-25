/**
 * ```markdown
 * [`SystemModule`] 功能说明：
 *
 * 1. 与业务本身无关的公共 API。
 *
 * ```
 */

import { Module } from '@nestjs/common'
import { SystemController } from './system.controller'
import { SystemService } from './system.service'

@Module({
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
