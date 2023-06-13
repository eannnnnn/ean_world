import { Global, Module } from '@nestjs/common';
import { ConfigModule as NextConfigModule } from '@nestjs/config';
import ConfigService from './config.service';

@Global()
@Module({
  imports: [
    NextConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],

  providers: [ConfigService],
  exports: [ConfigService],
})
export default class ConfigModule {}
