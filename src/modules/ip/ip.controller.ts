import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryIpQueryDto } from './ip.dto'
import { IpService } from './ip.service'

@ApiTags('weather')
@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Get('')
  async queryIp(@Query() query: QueryIpQueryDto, @Ip() ip: string) {
    const queriedIp = query.ip ? query.ip : ip
    return this.ipService.queryIp(queriedIp)
  }
}
