import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashService } from '../shared/hash.service';
import { PaginationService } from '../shared/pagination.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, HashService, PaginationService],
  exports: [UserService],
})
export class UserModule {}
