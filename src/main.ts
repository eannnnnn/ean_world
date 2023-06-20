import helmet from '@fastify/helmet';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import ErrorResponseDTO from './errors/error-response.dto';
import { AppModule } from './modules/app.module';
import ConfigService from './modules/config/config.service';
import FastifyMultipart from '@fastify/multipart';

/** Swagger Open API Documents */
function openApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Ean World')
    .setDescription('api document for ean world')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ErrorResponseDTO],
  });

  SwaggerModule.setup('api-document', app, document);
}

/** Main */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  await app.register(helmet);
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false,
  });

  app.register(FastifyMultipart, {
    // attachFieldsToBody: true,
    addToBody: true,
    logLevel: 'debug',
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 1000000, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });

  openApiDocument(app);
  const port = app.get(ConfigService).get('APP_PORT');
  await app.listen(port || 3000, '0.0.0.0', (err) => {
    if (err) throw err;

    process.send?.('ready');
  });

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap();
