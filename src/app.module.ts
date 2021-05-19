import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DebugModule } from './modules/debug/debug.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import getConfig from 'life-helper-config'

@Module({
  imports: [TypeOrmModule.forRoot(getConfig('TypeOrm')), DebugModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
