import { IsNotEmpty, IsString } from 'class-validator'

export class ScanQueryDto {
  /** 校验码 */
  @IsString()
  @IsNotEmpty()
  code: string
}

export class ScanResponseDto {
  scanTime: number
}

export class ConfirmQueryDto extends ScanQueryDto {}

export class ConfirmResponseDto {
  confirmTime: number
}
