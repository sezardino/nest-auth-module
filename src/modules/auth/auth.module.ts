import { Module } from '@nestjs/common';
import { HashService } from '../shared/hash/hash.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashService, LocalStrategy],
})
export class AuthModule {}
