import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const ApiSummary = (summary: string) =>
  applyDecorators(
    ApiOperation({
      summary,
    }),
  );
