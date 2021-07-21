import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class UpdateWxUserInfoRequestDto {
  @IsString()
  @IsNotEmpty()
  avatarUrl: string

  @IsString()
  city: string

  @IsString()
  country: string

  @IsInt()
  gender: number

  @IsString()
  @IsNotEmpty()
  nickName: string

  @IsString()
  province: string
}

export class ModifyAvatarRequestDto {
  @IsString()
  @IsNotEmpty()
  avatarUrl: string
}
