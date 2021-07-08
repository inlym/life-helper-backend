import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DebugItem } from './debug-item.entity'
import { DebugItemService } from './debug-item.service'
import { DebugProject } from './debug-project.entity'
import { DebugProjectService } from './debug-project.service'
import { DebugController } from './debug.controller'

/**
 * 当前模块用于处理调试相关逻辑
 */
@Module({
  imports: [TypeOrmModule.forFeature([DebugProject, DebugItem])],
  controllers: [DebugController],
  providers: [DebugProjectService, DebugItemService],
})
export class DebugModule {}
