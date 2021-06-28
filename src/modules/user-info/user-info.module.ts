import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserInfoService } from './user-info.service'
import { UserInfoController } from './user-info.controller'
import { UserInfo } from './user-info.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo])],
  providers: [UserInfoService],
  controllers: [UserInfoController],
})
export class UserInfoModule {}
