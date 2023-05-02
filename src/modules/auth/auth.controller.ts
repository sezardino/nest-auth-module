import { Public } from '@/decorators/is-public';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from './interfaces/request-with-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: AuthDto })
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('sign-in')
  async signIn(@Request() request: RequestWithUser) {
    const user = request.user;
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(request.user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { ...user, access_token };
  }

  @ApiBody({ type: AuthDto })
  @Public()
  @Post('sign-up')
  async signUp(@Request() request: RequestWithUser, @Body() dto: AuthDto) {
    const user = await this.authService.signUp(dto);
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { ...user, access_token };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Request() request: RequestWithUser) {
    const user = request.user;
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { access_token };
  }

  @Get('me')
  async me(@Request() request: RequestWithUser) {
    return request.user;
  }

  @Post('sign-out')
  async signOut(@Request() request: RequestWithUser) {
    await this.authService.signOut(request.user.email);
    const refreshCookieString = this.authService.getCookiesForLogOut();

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { success: true };
  }
}
