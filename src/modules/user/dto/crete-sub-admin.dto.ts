import { ApiProperty } from '@nestjs/swagger';

export class CreateSubAdminDto {
  @ApiProperty({
    example: 'test@mail.com',
    description: 'email of the sub admin',
  })
  email: string;

  @ApiProperty({
    example: 'password1',
    description: 'password of the sub admin',
  })
  password: string;
}
