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
