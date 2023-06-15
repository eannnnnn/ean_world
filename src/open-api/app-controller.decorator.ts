import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const AppController = (path: string, tag = 'default') =>
  applyDecorators(Controller(path), ApiTags(tag));
