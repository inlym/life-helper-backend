import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmOptions, RedisOtions } from './config'

// Middleware
import { UserMiddleware } from './common/middlewares/user.middleware'

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
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*')
  }
}
