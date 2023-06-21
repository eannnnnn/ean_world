import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from './error.const';

export default class ErrorResponseDTO {
  constructor(
    statusCode: number,
    timestamp: string,
    path: string,
    errorCode: string,
    response?: any,
  ) {
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.path = path;
    this.errorCode = errorCode;
    this.response = response;
  }

  @ApiProperty({
    description: 'HTTP 상태 코드',
    default: 400,
  })
  declare statusCode: number;

  @ApiProperty({
    description: '에러 발생 시간',
    default: '2021-01-01T00:00:00.000Z',
  })
  declare timestamp: string;

  @ApiProperty({
    description: '에러 발생 경로',
    default: '/v1/health',
  })
  declare path: string;

  @ApiProperty({
    type: 'enum',
    enum: ErrorCode,
    description: '에러 코드',
  })
  declare errorCode: string;

  @ApiProperty({
    description: '에러 응답',
  })
  declare response: any;
}
