import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'
import { WeatherCity } from './weather-city.entity'

/**
 * 小程序调用 `wx.chooseLocation` 获取的数据
 *
 * @see
 * [wx.chooseLocation](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html)
 */
export class WxChooseLocationResult {
  /** 位置名称 */
  @IsString()
  @IsNotEmpty()
  name: string

  /** 详细地址 */
  @IsString()
  @IsNotEmpty()
  address: string

  /** 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系 */
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number

  /** 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系 */
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number
}

/**
 * 新增天气城市响应数据
 */
@Exclude()
export class AddResponseDto extends WeatherCity {
  /** 主键 ID */
  @Expose()
  id: number
}
