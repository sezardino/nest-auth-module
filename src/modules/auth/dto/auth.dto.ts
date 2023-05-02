import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'test@mail.com', description: 'email of the user' })
  email: string;

  @ApiProperty({ example: 'password1', description: 'email of the user' })
  password: string;
}
