import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisConfig, TypeOrmConfig } from 'life-helper-config'
import { RedisModule } from 'nestjs-redis'
import { AllExceptionFilter } from './common/all-exception.filter'
import { UserMiddleware } from './common/user.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { CalendarModule } from './modules/calendar/calendar.module'
import { DebugModule } from './modules/debug/debug.module'
import { LocationModule } from './modules/location/location.module'
import { OssModule } from './modules/oss/oss.module'
import { UserInfoModule } from './modules/user-info/user-info.module'
import { UserModule } from './modules/user/user.module'
import { WeatherModule } from './modules/weather/weather.module'
import { WeixinModule } from './modules/weixin/weixin.module'

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
    CalendarModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    /** 中间件列表 */
    const middlewares = [UserMiddleware]

    consumer.apply(UserMiddleware).forRoutes('*')
    consumer.apply(...middlewares).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
