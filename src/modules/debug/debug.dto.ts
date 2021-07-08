import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProjectRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  description: string
}

@Exclude()
export class CreateProjectResponseDto {}
