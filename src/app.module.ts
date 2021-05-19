import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DebugModule } from './modules/debug/debug.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WeixinModule } from './modules/weixin/weixin.module'
import config from 'life-helper-config'

@Module({
  imports: [TypeOrmModule.forRoot(config['TypeOrm']), DebugModule, WeixinModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
