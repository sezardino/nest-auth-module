import { Public } from '@/decorators/is-public';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUserData } from '../user/user.schema';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from './interfaces/request-with-user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  @ApiBody({ type: AuthDto })
  @ApiOperation({ summary: 'Sign in to system with email and password' })
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() request: RequestWithUser) {
    const user = request.user;
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(request.user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { ...user, access_token };
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up with email and password' })
  @ApiBody({ type: AuthDto })
  async signUp(@Request() request: RequestWithUser, @Body() dto: AuthDto) {
    const user = await this.authService.signUp(dto);
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { ...user, access_token };
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh access_token' })
  @ApiBearerAuth()
  async refresh(@Request() request: RequestWithUser) {
    const user = request.user;
    const { access_token, refreshCookieString } =
      await this.authService.generateCredentials(user);

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { access_token };
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user data' })
  async me(@Request() request: RequestWithUser): Promise<CurrentUserData> {
    const userData: CurrentUserData = {
      email: request.user.email,
      role: request.user.role,
    };

    return userData;
  }

  @Post('sign-out')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from system' })
  async signOut(@Request() request: RequestWithUser) {
    await this.authService.signOut(request.user.email);
    const refreshCookieString = this.authService.getCookiesForLogOut();

    request.res.setHeader('Set-Cookie', refreshCookieString);

    return { success: true };
  }
}
