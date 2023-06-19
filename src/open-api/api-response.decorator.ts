import { HttpCode, HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiBadRequestResponse as _ApiBadRequestResponse,
  ApiCreatedResponse as _ApiCreatedResponse,
  ApiOkResponse as _ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import ErrorResponseDTO from 'src/errors/error-response.dto';
import { ErrorCode } from 'src/errors/error.const';

const parseType = (type: Type<any>, isArray = false) => {
  if (isArray) {
    if (typeof type === 'object') {
      return {
        schema: {
          allOf: [
            {
              type: 'array',
              items: {
                $ref: getSchemaPath(type),
              },
            },
          ],
        },
      };
    } else {
      return {
        schema: {
          allOf: [
            {
              type: 'array',
              items: {
                type: type.name.toLowerCase(),
              },
            },
          ],
        },
      };
    }
  } else if (typeof type === 'object') {
    return {
      schema: {
        allOf: [
          {
            properties: {
              type: 'object',
              $ref: getSchemaPath(type),
            },
          },
        ],
      },
    };
  }

  return {
    type,
  };
};

export const ApiOkResponse = <T extends Type<any>>(
  description: string,
  type?: T,
  options?: {
    isArray: boolean;
  },
) =>
  applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiExtraModels(type ?? Boolean),
    _ApiOkResponse({
      description,
      ...(type ? parseType(type, options?.isArray) : {}),
    }),
  );

export const ApiCreatedResponse = <T extends Type<any>>(
  description: string,
  type?: T,
) =>
  applyDecorators(
    HttpCode(HttpStatus.CREATED),
    _ApiCreatedResponse({
      description,
      type,
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
