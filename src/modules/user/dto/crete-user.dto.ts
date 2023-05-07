import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.schema';

export class CreateUserDto {
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

  @ApiProperty()
  @IsEnum(UserRole)
  role?: UserRole;
}
