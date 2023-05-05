import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../user/user.schema';

type JWTType = 'access' | 'refresh';

export interface JWTPayload {
  email: string;
  role: UserRole;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateTokens(user: User) {
    const payload: JWTPayload = {
      email: user.email,
      role: user.role,
    };

    const access_token = this.generateJWT(payload, 'access');

    const refresh_token = this.generateJWT(payload, 'refresh');

    return {
      access_token,
      refresh_token,
    };
  }

  private generateJWT(payload: JWTPayload, type: JWTType) {
    return this.jwtService.sign(payload, this.getJwtSecrets(type));
  }

  private getJwtSecrets(type: JWTType) {
    switch (type) {
      case 'access':
        return {
          expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRATION_TIME'),
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        };
      case 'refresh':
        return {
          expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRATION_TIME'),
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        };
      default:
        throw new Error('Invalid JWT type');
    }
  }
}
