import { Module } from '@nestjs/common';
import HealthModule from './health/health.module';
import DatabaseModule from './database/database.module';
import ConfigModule from './config/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule],
})
export class AppModule {}
