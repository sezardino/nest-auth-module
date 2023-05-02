import { IS_PUBLIC_KEY } from '@/decorators/is-public';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { JWT_ACCESS_STRATEGY_NAME } from '../strategies/jwt-access.strategy';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_STRATEGY_NAME) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
