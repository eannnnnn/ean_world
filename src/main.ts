import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import ConfigService from './modules/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  const port = app.get(ConfigService).get('APP_PORT');
  await app.listen(port || 3000, '0.0.0.0');
}

bootstrap();
