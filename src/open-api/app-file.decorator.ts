import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FileType } from 'src/modules/file/file.const';
import { FileInterceptor } from 'src/modules/file/file.interceptor';

type Params = Parameters<typeof FileInterceptor>;

export const AppFile = (
  name: Params[0],
  allowType: Params[1] = FileType.ALL,
  maxLength: Params[2] = 1,
) =>
  applyDecorators(
    UseInterceptors(FileInterceptor(name, allowType, maxLength)),
    ApiConsumes('multipart/form-data'),
  );
