import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateSubAdminDto {
  @ApiProperty({
    example: 'test@mail.com',
    description: 'email of the sub admin',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password1',
    description: 'password of the sub admin',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
