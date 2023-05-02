import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const REFRESH_TOKEN_COOKIE_NAME = 'Refresh';

@Injectable()
export class CookieService {
  constructor(private readonly config: ConfigService) {}

  private getCookieString(name: string, value: string, expirationTime: string) {
    return `${name}=${value}; HttpOnly; Path=/; Max-Age=${expirationTime}`;
  }

  getRefreshCookieString(token: string, expirationTime?: string) {
    const deadline = expirationTime
      ? expirationTime
      : this.config.get<string>('REFRESH_TOKEN_COOKIE_EXPIRATION_TIME');

    return this.getCookieString(REFRESH_TOKEN_COOKIE_NAME, token, deadline);
  }
}
