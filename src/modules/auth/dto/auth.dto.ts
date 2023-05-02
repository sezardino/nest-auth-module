import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'test@mail.com', description: 'email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password1', description: 'email of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}
