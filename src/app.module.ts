import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { DebugModule } from './modules/debug/debug.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { WeixinModule } from './modules/weixin/weixin.module'
import { LoggerService } from './common/services/logger/logger.service'
import { AuthModule } from './modules/auth/auth.module'
import { AuthService } from './modules/auth/auth.service'
import { TypeOrmOptions, RedisOtions } from './config'
import { OssModule } from './modules/oss/oss.module'
import { UserModule } from './modules/user/user.module'
import { UserService } from './modules/user/user.service'

import { UseridMiddleware } from './common/middlewares/userid.middleware'

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmOptions), RedisModule.register(RedisOtions), DebugModule, WeixinModule, AuthModule, OssModule, UserModule],
  controllers: [AppController],
  providers: [LoggerService, AuthService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseridMiddleware).forRoutes('*')
  }
}
