import { Exclude, Expose } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

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

/**
 * 新增任务的请求数据
 */
export class CreateTaskRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  projectId?: number

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  content: string

  @IsOptional()
  @IsDateString()
  startTime?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  timeType: number
}
