import { UserRole } from '../user.schema';

export class FindUsersDto {
  page?: number;
  limit?: number;
  role?: UserRole;
}
