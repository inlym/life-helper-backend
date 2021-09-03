import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserInfoModule } from './user-info/user-info.module'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature(UserEntity), UserInfoModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
