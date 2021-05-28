import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { TypeOrmOptions, RedisOtions } from './config'

// Module
import { DebugModule } from './modules/debug/debug.module'
import { WeixinModule } from './modules/weixin/weixin.module'
import { AuthModule } from './modules/auth/auth.module'
import { OssModule } from './modules/oss/oss.module'
import { UserModule } from './modules/user/user.module'

// `Service`
import { LoggerService } from './common/services/logger/logger.service'
import { AuthService } from './modules/auth/auth.service'
import { UserService } from './modules/user/user.service'
import { WeixinService } from './modules/weixin/weixin.service'

// Middleware
import { UserMiddleware } from './common/middlewares/user.middleware'
import { WeatherModule } from './modules/weather/weather.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmOptions),
    RedisModule.register(RedisOtions),
    DebugModule,
    WeixinModule,
    AuthModule,
    OssModule,
    UserModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [LoggerService, AuthService, UserService, WeixinService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
