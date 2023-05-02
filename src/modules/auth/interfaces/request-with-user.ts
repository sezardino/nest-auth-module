import { User } from '@/modules/user/user.schema';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
