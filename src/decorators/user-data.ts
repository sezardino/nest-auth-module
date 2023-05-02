import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserEmail = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();

    return request.user?.email;
  },
);

export const CurrentUserRole = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();

    return request.user?.role;
  },
);
