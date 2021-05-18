import { Module } from '@nestjs/common'
import { DebugController } from './debug.controller';

/**
 * 当前模块用于处理调试相关逻辑
 */
@Module({
  controllers: [DebugController]
})
export class DebugModule {}
