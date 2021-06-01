import { IsString, IsNotEmpty, IsIn } from 'class-validator'

export class updateReqDto {
  @IsString()
  @IsNotEmpty()
  avatarUrl: string

  @IsString()
  city: string

  @IsString()
  country: string

  @IsIn([0, 1, 2])
  gender: number

  @IsString()
  @IsNotEmpty()
  nickName: string

  @IsString()
  province: string
}
