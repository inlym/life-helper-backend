import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsLowercase, IsUUID, Min } from 'class-validator'

/**
 * 大部分 `GET` 请求只需要传一个 `id` 参数
 */
export class QueryId {
  @ApiProperty()
  @IsInt()
  @Min(1)
  id: number
}

/**
 * 部分需要隐藏 `id` 的情况，使用一个随机 UUIDv4 替代 `id`
 */
export class QuerySID {
  @IsUUID(4)
  @IsLowercase()
  sid: string
}
