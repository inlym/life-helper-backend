import { ApiProperty } from '@nestjs/swagger'
import { IsIP, IsOptional } from 'class-validator'

export class QueryIpQueryDto {
  @ApiProperty({
    description: 'IP 地址，仅限 IPv4',
  })
  @IsOptional()
  @IsIP('4')
  ip?: string
}
