import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import JwtGuard from 'src/modules/account/account.guard';

export const AppJwtGuard = applyDecorators(
  ApiBearerAuth(),
  ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않을경우 401',
  }),
  UseGuards(JwtGuard),
);
