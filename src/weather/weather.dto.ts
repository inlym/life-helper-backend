import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class GetWeatherQueryDto {
  /** `lng,lat` 格式的经纬度坐标 */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string

  /** `lng,lat` 格式的经纬度坐标 */
  @IsOptional()
  @IsInt()
  city_id?: number
}
