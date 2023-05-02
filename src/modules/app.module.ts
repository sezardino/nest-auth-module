import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../config/mongo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HashService } from './shared/hash/hash.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [HashService],
})
export class AppModule {}
