import { IsIP, IsOptional } from 'class-validator'

export class QueryIpQueryDto {
  /** IP 地址 */
  @IsOptional()
  @IsIP('4')
  ip: string
}
