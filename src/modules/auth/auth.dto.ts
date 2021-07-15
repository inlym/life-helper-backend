import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsNotEmpty, IsString, IsIn } from 'class-validator'

export class ConfirmLoginRequestDto {
  @ApiProperty({ description: '校验串，即小程序端获取的 `scene` 值' })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  code: string
}

export class ConfirmLoginQueryDto {
  @ApiProperty({ description: '需要进行的操作，`scan` - 仅扫码，`confirm` - 扫码确认' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['scan', 'confirm'])
  type: string
}

export class LoginByQrCodeQueryDto extends ConfirmLoginRequestDto {}
