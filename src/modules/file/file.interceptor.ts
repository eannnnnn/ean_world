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
import { MultipartFile } from 'src/common/file';
import { UUID } from 'crypto';
import { isUUID } from 'class-validator';

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

      const files = request.body[paramName] as (MultipartFile | UUID)[];

      if (!files) {
        request.body[paramName] = [];
        return next.handle();
      }

      if (files.length > maxLength)
        throw new BadRequestException(ErrorCode.FILE_MAX_LENGTH_EXCEEDED);

      const arr = [];
      for await (const file of files) {
        // uuid 일 경우
        if (typeof file === 'string' && isUUID(file)) {
          const existFile = await this.fileService.getFile(file);
          arr.push(existFile.id);
          continue;
        } else if (typeof file === 'string') {
          throw new BadRequestException(ErrorCode.NOT_FOUND);
        }

        if (allowType !== FileType.ALL && !file.mimetype.startsWith(allowType))
          throw new BadRequestException(ErrorCode.FILE_NOT_ALLOWED);

        const fileId = await this.fileService.uploadFile(file);
        arr.push(fileId);
      }
      request.body[paramName] = arr;
      return next.handle();
    }
  }

  const interceptor = mixin(FileInterceptorMixin);
  return interceptor;
};
