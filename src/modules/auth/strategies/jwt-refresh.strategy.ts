import { REFRESH_TOKEN_COOKIE_NAME } from '@/modules/shared/cookie.service';
import { JWTPayload } from '@/modules/shared/token.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export const JWT_REFRESH_STRATEGY_NAME = 'refresh-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY_NAME,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JWTPayload) {
    const user = await this.authService.validateToken(
      payload.email,
      request?.cookies?.[REFRESH_TOKEN_COOKIE_NAME],
    );

    if (!user) throw new UnauthorizedException('Invalid token');

    return user;
  }
}
