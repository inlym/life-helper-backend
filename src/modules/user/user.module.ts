import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from 'src/shared/shared.module'
import { UserService } from './user.service'
import { UserEntity } from './user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharedModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
