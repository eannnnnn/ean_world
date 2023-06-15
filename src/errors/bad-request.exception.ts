import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error.const';

export default class BadRequestException extends HttpException {
  constructor(code: ErrorCode) {
    super(code.toString(), HttpStatus.BAD_REQUEST);
  }
}
