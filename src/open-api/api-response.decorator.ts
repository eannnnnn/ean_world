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
  options?: {
    isArray: boolean;
  },
) =>
  applyDecorators(
    HttpCode(HttpStatus.CREATED),
    _ApiCreatedResponse({
      description,
      ...(type ? parseType(type, options?.isArray) : {}),
    }),
    ApiExtraModels(type ?? Boolean),
  );

type BadRequestParam = {
  code: ErrorCode;
  summary: string;
};

export const ApiBadRequestResponse = (...errors: BadRequestParam[]) =>
  applyDecorators(
    _ApiBadRequestResponse({
      description: 'Bad Request',
      status: HttpStatus.BAD_REQUEST,
      content: {
        'application/json': {
          schema: {
            $ref: getSchemaPath(ErrorResponseDTO),
          },
          examples: {
            ...Object.fromEntries(
              errors.map(({ code, summary }) => [
                code,
                {
                  summary,
                  value: new ErrorResponseDTO(
                    HttpStatus.BAD_REQUEST,
                    new Date().toISOString(),
                    '/',
                    code,
                  ),
                },
              ]),
            ),
          },
        },
      },
    }),
  );
