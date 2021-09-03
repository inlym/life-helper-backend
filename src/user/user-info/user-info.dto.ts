import { Exclude } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserInfo } from './user-info.entity'

/** ────────────────────  getUserInfo  ──────────────────── */

/** 获取用户个人信息 - 响应数据 */
export class GetUserInfoResponseDto extends UserInfo {
  @Exclude()
  id: number
}

/** ────────────────────  updateUserInfo  ──────────────────── */

/** 更新用户个人信息 - 请求数据 */
export class UpdateUserInfoRequestDto {
  /** 昵称 */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nickName?: string

  /** 头像图片的 URL */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatarUrl?: string

  /** 性别 */
  @IsOptional()
  @IsInt()
  gender?: number

  /** 国家 */
  @IsOptional()
  @IsString()
  country?: string

  /** 省份 */
  @IsOptional()
  @IsString()
  province?: string

  /** 城市 */
  @IsOptional()
  @IsString()
  city?: string
}

/** 更新用户个人信息 - 响应数据 */
export class UpdateUserInfoResponseDto extends UserInfo {
  @Exclude()
  id: number
}
