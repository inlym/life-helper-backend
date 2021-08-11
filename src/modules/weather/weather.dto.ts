import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

/**
 * 小程序调用 `wx.chooseLocation` 获取的数据
 */
export class WxChooseLocationResult {
  @IsString()
  @IsNotEmpty()
  /** 位置名称 */
  name: string

  @IsString()
  @IsNotEmpty()
  /** 详细地址 */
  address: string

  @IsNumber()
  @Min(-90)
  @Max(90)
  /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
  latitude: number

  @IsNumber()
  @Min(-180)
  @Max(180)
  /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
  longitude: number
}

export class GetOrdinaryWeatherQueryDto {
  /** 和风天气中的 `LocationId` */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location_id: string

  /** `lng,lat` 格式的经纬度坐标 */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location: string
}

export class GetPrivateWeatherQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  city_id?: number
}
