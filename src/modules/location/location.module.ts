import { Module } from '@nestjs/common'
import { LocationController } from './location.controller'
import { LocationService } from './location.service'
import { LbsqqService } from './lbsqq.service'

@Module({
  controllers: [LocationController],
  providers: [LocationService, LbsqqService],
})
export class LocationModule {}
