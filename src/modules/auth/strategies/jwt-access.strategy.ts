import { JWTPayload } from '@/modules/shared/token.service';
import { UserService } from '@/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export const JWT_ACCESS_STRATEGY_NAME = 'access-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  JWT_ACCESS_STRATEGY_NAME,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JWTPayload) {
    const user = await this.userService.findOneByEmail(payload.email);

    return user;
  }
}
