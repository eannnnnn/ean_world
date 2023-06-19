import { Module } from '@nestjs/common';
import HealthModule from './health/health.module';
import DatabaseModule from './database/database.module';
import ConfigModule from './config/config.module';
import AccountModule from './account/account.module';
import AllExceptionFilter from 'src/filter/error.filter';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import ConfigService from './config/config.service';
import FeedModule from './feed/feed.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'jwt secret',
        global: true,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    HealthModule,
    AccountModule,
    FeedModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
