import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiBadRequestResponse as _ApiBadRequestResponse,
  ApiCreatedResponse as _ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import ErrorResponseDTO from 'src/errors/error-response.dto';
import { ErrorCode } from 'src/errors/error.const';

export const ApiCreatedResponse = <T extends Type<any>>(
  description: string,
  type?: T,
) =>
  applyDecorators(
    _ApiCreatedResponse({
      description,
      ...(type ? { type } : {}),
    }),
    ApiExtraModels(type ?? Boolean),
  );

export const ApiBadRequestResponse = (description: string, code: ErrorCode) =>
  applyDecorators(
    _ApiBadRequestResponse({
      description,
      status: HttpStatus.BAD_REQUEST,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ErrorResponseDTO) },
          {
            properties: {
              errorCode: {
                type: 'enum',
                enum: Object.values(ErrorCode),
                example: code,
              },
            },
          },
        ],
      },
    }),
  );
