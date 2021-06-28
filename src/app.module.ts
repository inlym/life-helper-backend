import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_INTERCEPTOR } from '@nestjs/core'

// Config
import { TypeOrmConfig, RedisConfig } from 'life-helper-config'

// Interceptor
import { SuccessMessageInterceptor } from './common/success-message.interceptor'

// Middleware
import { UserMiddleware } from './common/user.middleware'

// Module
import { DebugModule } from './modules/debug/debug.module'
import { WeixinModule } from './modules/weixin/weixin.module'
import { AuthModule } from './modules/auth/auth.module'
import { OssModule } from './modules/oss/oss.module'
import { UserModule } from './modules/user/user.module'
import { WeatherModule } from './modules/weather/weather.module'
import { LocationModule } from './modules/location/location.module'
import { UserInfoModule } from './modules/user-info/user-info.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    RedisModule.register(RedisConfig),
    ScheduleModule.forRoot(),
    DebugModule,
    WeixinModule,
    AuthModule,
    OssModule,
    UserModule,
    WeatherModule,
    LocationModule,
    UserInfoModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessMessageInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
