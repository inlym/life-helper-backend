import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

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

export class GetOssClientTokenQueryDto {
  /**
   * 需要获取的凭证数量
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  n: number

  /**
   * 需要获取的凭证类型（对应不同的文件夹和上传限制）
   */
  @IsOptional()
  @IsString()
  @IsIn(['picture', 'video'])
  type: string
}
