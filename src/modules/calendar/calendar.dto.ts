import { Exclude, Expose } from 'class-transformer'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateProjectReqDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

@Exclude()
export class CreateProjectResDto {
  @Expose()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string
}
