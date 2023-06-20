import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  mixin,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';
import FileService from './file.service';
import { FileType } from './file.const';
import BadRequestException from 'src/errors/bad-request.exception';
import { ErrorCode } from 'src/errors/error.const';

export const FileInterceptor = (
  paramName: string,
  allowType: FileType = FileType.ALL,
  maxLength = 1,
) => {
  @Injectable()
  class FileInterceptorMixin implements NestInterceptor {
    constructor(public readonly fileService: FileService) {}

    async intercept(
      ctx: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = ctx.switchToHttp().getRequest() as FastifyRequest;
      const files = request.files({
        limits: {
          files: maxLength,
        },
      });
      request[paramName] = [];
      for await (const file of files) {
        if (file.fieldname !== paramName) continue;

        if (allowType !== FileType.ALL && !file.mimetype.startsWith(allowType))
          throw new BadRequestException(ErrorCode.FILE_NOT_ALLOWED);

        const fileId = await this.fileService.uploadFile(file);
        request[paramName].push(fileId);
      }

      return next.handle();
    }
  }

  const interceptor = mixin(FileInterceptorMixin);
  return interceptor;
};
