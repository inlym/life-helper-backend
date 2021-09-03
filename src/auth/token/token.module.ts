import { Module } from '@nestjs/common'
import { TokenService } from './token.service'

@Module({
  providers: [TokenService],
})
export class TokenModule {}
