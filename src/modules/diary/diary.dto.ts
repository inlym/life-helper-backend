import { IsArray, IsOptional, IsString } from 'class-validator'
import { WxLocationDto } from 'src/shared/place/place.model'

export class AddDiaryRequestDto {
  /** 内容文本 */
  @IsString()
  content: string

  /** 照片列表 */
  @IsArray()
  @IsOptional()
  images: string[]

  /** 视频列表 */
  @IsArray()
  @IsOptional()
  videos: string[]

  /** 位置信息 */
  @IsOptional()
  location: WxLocationDto
}
