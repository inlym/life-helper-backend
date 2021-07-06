import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class GetClientTokenQueryDto {
  /**
   * 需要获取的凭证数量
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  n: number

  /**
   * 需要获取的凭证类型（对应不同的文件夹和上传限制）
   */
  @IsOptional()
  @IsString()
  @IsIn(['picture', 'video'])
  type: string
}
