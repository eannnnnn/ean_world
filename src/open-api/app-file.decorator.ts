import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileType } from 'src/modules/file/file.const';
import { FileInterceptor } from 'src/modules/file/file.interceptor';

type Params = Parameters<typeof FileInterceptor>;

export const AppFile = (
  name: Params[0],
  allowType: Params[1] = FileType.ALL,
  maxLength: Params[2] = 1,
) =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FileInterceptor(name, allowType, maxLength)),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [name]: {
            description: `최대 ${maxLength}개의 파일을 업로드 할 수 있습니다.`,
            type: maxLength > 1 ? 'array' : 'file',
            ...(maxLength > 1
              ? {
                  items: {
                    type: 'file',
                  },
                }
              : {}),
          },
        },
      },
    }),
  );
