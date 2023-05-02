import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  config: ConfigService,
): Promise<MongooseModuleOptions> => ({
  uri: config.get('MONGO_URI'),
});
