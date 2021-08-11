import { Module } from '@nestjs/common'
import { SharedModule } from 'src/shared/shared.module'
import { DebugController } from './debug.controller'

/**
 * 当前模块用于处理调试相关逻辑
 */
@Module({
  imports: [SharedModule],
  controllers: [DebugController],
})
export class DebugModule {}
