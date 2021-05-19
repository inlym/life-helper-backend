import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { DebugModule } from './modules/debug/debug.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { WeixinModule } from './modules/weixin/weixin.module'
import { LoggerService } from './common/services/logger/logger.service'
import config from 'life-helper-config'

@Module({
  imports: [TypeOrmModule.forRoot(config['TypeOrm']), RedisModule.register(config['Redis']), DebugModule, WeixinModule],
  controllers: [AppController],
  providers: [LoggerService],
})
export class AppModule {}
