import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class GetPublicWeatherQueryDto {
  /** 和风天气中的 `LocationId` */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location_id?: string

  /** `lng,lat` 格式的经纬度坐标 */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string
}
