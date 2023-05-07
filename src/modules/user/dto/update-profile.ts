import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    example: 'Michał',
    description: 'user name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Wolek',
    description: 'user surname',
  })
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({
    example: 'ul 11 listopada 23',
    description: 'user address',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
