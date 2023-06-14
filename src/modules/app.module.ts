import { Module } from '@nestjs/common';
import HealthModule from './health/health.module';
import DatabaseModule from './database/database.module';
import ConfigModule from './config/config.module';
import UserModule from './user/user.module';

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule, UserModule],
})
export class AppModule {}
