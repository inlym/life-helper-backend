import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator'

/**
 * 小程序调用 `wx.chooseLocation` 方法获取的有效数据
 */
export interface WxLocation {
  /** 位置名称 */
  name: string

  /** 详细地址 */
  address: string

  /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
  latitude: number

  /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
  longitude: number
}

export class WxLocationDto {
  /** 位置名称 */
  @IsString()
  @IsNotEmpty()
  name: string

  /** 详细地址 */
  @IsString()
  @IsNotEmpty()
  address: string

  /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
  @IsLatitude()
  latitude: number

  /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
  @IsLongitude()
  longitude: number
}
