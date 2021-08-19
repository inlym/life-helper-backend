import { Controller, Get, Ip, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueryIpQueryDto } from './ip.dto'
import { IpService } from './ip.service'

@ApiTags('ip')
@Controller('ip')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  @Get('')
  async queryIp(@Query() query: QueryIpQueryDto, @Ip() ip: string) {
    const queriedIp = query.ip ? query.ip : ip
    const ipInfo = await this.ipService.queryIp(queriedIp)

    return { ...ipInfo, clientIp: ip }
  }
}
