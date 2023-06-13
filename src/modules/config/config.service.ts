import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

type EnvConfig = {
  // APP
  APP_PORT: string;

  // DB
  DB_TYPE: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_ENDPOINT: string;
  DB_DATABASE_NAME: string;
  // SSH
  SSH_USERNAME: string;
  SSH_PASSWORD: string;
  SSH_HOST: string;
  SSH_PORT: string;
};

@Injectable()
export default class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get<T extends keyof EnvConfig>(key: T) {
    return this.config.get<EnvConfig[T]>(key);
  }

  getOrThrow<T extends keyof EnvConfig>(key: T) {
    return this.config.getOrThrow<EnvConfig[T]>(key);
  }
}
