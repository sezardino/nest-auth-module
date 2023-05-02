import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';

type HashType = 'password' | 'token';

@Injectable()
export class HashService {
  constructor(private readonly config: ConfigService) {}

  private getSecret(type: HashType) {
    switch (type) {
      case 'password':
        return this.config.get<string>('PASSWORD_HASH_SECRET');
      case 'token':
        return this.config.get<string>('ACCESS_HASH_SECRET');
      default:
        throw new Error('Invalid secret type');
    }
  }

  async hash(plainText: string, type: HashType) {
    return hash(plainText, {
      secret: Buffer.from(this.getSecret(type)),
    });
  }

  async verify(hash: string, plainText: string, type: HashType) {
    return verify(hash, plainText, {
      secret: Buffer.from(this.getSecret(type)),
    });
  }
}
