import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator'

export class ConfirmLoginRequestDto {
  @ApiProperty({ description: '校验串，即小程序端获取的 `scene` 值' })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  code: string
}

export class LoginByQrCodeQueryDto extends ConfirmLoginRequestDto {}
