import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '../shared/hash/hash.service';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const isPasswordMatch = await this.hashService.verify(
      user.password,
      password,
      'password',
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;

    return user;
  }

  async signUp(dto: AuthDto): Promise<User> {
    const isUserExist = await this.userService.findOneByEmail(dto.email);

    if (isUserExist) throw new UnauthorizedException('User already exist');

    const hashedPassword = await this.hashService.hash(
      dto.password,
      'password',
    );

    return this.userService.create(dto.email, hashedPassword);
  }
}
