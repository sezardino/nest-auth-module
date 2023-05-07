import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'password1',
    description: 'password of the sub admin',
  })
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({
    example: 'password1',
    description: 'password of the sub admin',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
