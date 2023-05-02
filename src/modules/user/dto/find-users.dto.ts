import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '../user.schema';

export class FindUsersDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
