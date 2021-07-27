import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserInfoController } from './user-info.controller'
import { UserInfo } from './user-info.entity'
import { UserInfoService } from './user-info.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  providers: [UserInfoService],
  controllers: [UserInfoController],
  exports: [UserInfoService],
})
export class UserInfoModule {}
