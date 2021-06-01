import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmOptions, RedisOtions } from './config'

// Module
import { DebugModule } from './modules/debug/debug.module'
import { WeixinModule } from './modules/weixin/weixin.module'
import { AuthModule } from './modules/auth/auth.module'
import { OssModule } from './modules/oss/oss.module'
import { UserModule } from './modules/user/user.module'
import { WeatherModule } from './modules/weather/weather.module'
import { LocationModule } from './modules/location/location.module'
import { UserInfoModule } from './modules/user-info/user-info.module'

// `Service`
import { LoggerService } from './common/services/logger/logger.service'
import { AuthService } from './modules/auth/auth.service'
import { UserService } from './modules/user/user.service'
import { WeixinService } from './modules/weixin/weixin.service'
import { LbsqqService } from './modules/location/lbsqq.service'
import { LocationService } from './modules/location/location.service'

// Middleware
import { UserMiddleware } from './common/middlewares/user.middleware'

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmOptions),
    RedisModule.register(RedisOtions),
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
  providers: [LoggerService, AuthService, UserService, WeixinService, LocationService, LbsqqService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
