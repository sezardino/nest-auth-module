import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieService } from '../shared/cookie.service';
import { HashService } from '../shared/hash.service';
import { TokenService } from '../shared/token.service';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    const isPasswordMatch = await this.hashService.verify(
      user.password,
      password,
      'password',
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return user.toJSON();
  }

  async validateToken(email: string, token: string) {
    const user = await this.userService.findOneByEmail(email);

    const isTokenMatch = await this.hashService.verify(
      user.token,
      token,
      'token',
    );

    if (!isTokenMatch) throw new UnauthorizedException('Invalid token');

    return user.toJSON();
  }

  async signUp(dto: AuthDto) {
    return this.userService.create(dto.email, dto.password);
  }

  async signOut(userEmail: string) {
    return this.userService.updateUserToken(userEmail, '');
  }

  async generateCredentials(user: User) {
    const { access_token, refresh_token } =
      this.tokenService.generateTokens(user);
    const refreshCookieString = this.getRefreshCookie(refresh_token);

    await this.userService.updateUserToken(user.email, refresh_token);

    return { access_token, refreshCookieString };
  }

  private getRefreshCookie(token: string) {
    return this.cookieService.getRefreshCookieString(token);
  }

  getCookiesForLogOut() {
    return this.cookieService.getRefreshCookieString('', '0');
  }
}
