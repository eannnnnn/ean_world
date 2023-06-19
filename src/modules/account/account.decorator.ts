import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
