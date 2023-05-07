import { IsEnum, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { UserRole } from '../user.schema';

export class FindUsersDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
