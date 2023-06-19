import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import ErrorResponseDTO from 'src/errors/error-response.dto';

@Catch()
export default class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = new ErrorResponseDTO(
      httpStatus,
      new Date().toISOString(),
      httpAdapter.getRequestUrl(ctx.getRequest()),
      exception.message || null,
      exception['response'],
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
