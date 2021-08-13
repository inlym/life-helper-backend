import { IsIn, IsString } from 'class-validator'

export class GetOssTokenQueryDto {
  @IsString()
  @IsIn(['video', 'image'])
  type: 'video' | 'image'
}
