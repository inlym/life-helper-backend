import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryIpQueryDto } from './ip.dto'
import { IpService } from './ip.service'
import { LocateIpResult } from 'src/shared/lbsqq/lbsqq.interface'

@ApiTags('ip')
@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Get('')
  async queryIp(@Query() query: QueryIpQueryDto, @Ip() ip: string): Promise<LocateIpResult> {
    const queriedIp = query.ip ? query.ip : ip
    return this.ipService.queryIp(queriedIp)
  }
}
