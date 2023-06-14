import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import ConfigService from './modules/config/config.service';
import { INestApplication, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';

function openApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Ean World')
    .setDescription('api document for ean world')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-document', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false,
  });

  openApiDocument(app);
  const port = app.get(ConfigService).get('APP_PORT');
  await app.listen(port || 3000, '0.0.0.0');
}

bootstrap();
