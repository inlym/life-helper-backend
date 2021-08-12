import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { UserInfoController } from './user-info.controller'
import { UserInfo } from './user-info.entity'
import { UserInfoService } from './user-info.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), SharedModule],
  providers: [UserInfoService],
  controllers: [UserInfoController],
  exports: [UserInfoService],
})
export class UserInfoModule {}
