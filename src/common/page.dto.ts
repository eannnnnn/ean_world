import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class PageDTO {
  @IsNumber()
  @ApiProperty({ required: false, example: 1, description: '페이지 번호' })
  page?: number = 1;

  @IsNumber()
  @ApiProperty({
    required: false,
    example: 10,
    description: '한번에 가져올 갯수',
  })
  limit?: number = 10;
}
