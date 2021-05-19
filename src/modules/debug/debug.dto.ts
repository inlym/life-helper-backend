import { ApiProperty } from '@nestjs/swagger'

export class GetEnvResponseDto {
  @ApiProperty({
    description: '环境变量',
    example: 'production',
  })
  NODE_ENV: string
}
