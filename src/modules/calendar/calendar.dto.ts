import { Exclude, Expose } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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
  @ApiProperty({
    required: false,
    description: '项目 ID',
  })
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
