import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator'

/**
 * `Project`
 */

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

@Exclude()
export class CreateProjectResponseDto {
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
  dueTime?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  timeType: number
}

export class GetAllTasksQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  project_id: number
}
