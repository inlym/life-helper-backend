import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisConfig, TypeOrmConfig } from 'life-helper-config'
import { RedisModule } from 'nestjs-redis'
import { AllExceptionFilter } from './common/all-exception.filter'
import { AuthMiddleware } from './common/auth.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { CalendarModule } from './modules/calendar/calendar.module'
import { DebugModule } from './modules/debug/debug.module'
import { DiaryModule } from './modules/diary/diary.module'
import { IpModule } from './modules/ip/ip.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserInfoModule } from './modules/user-info/user-info.module'
import { UserModule } from './modules/user/user.module'
import { WeatherModule } from './modules/weather/weather.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    RedisModule.register(RedisConfig),
    ScheduleModule.forRoot(),
    DebugModule,
    AuthModule,
    UserModule,
    WeatherModule,
    UserInfoModule,
    CalendarModule,
    IpModule,
    DiaryModule,
    UploadModule,
  ],

  providers: [{ provide: APP_FILTER, useClass: AllExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    /** 中间件列表 */
    const middlewares = [AuthMiddleware]

    consumer.apply(...middlewares).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
