import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export default class GetFileDTO {
  @IsUUID()
  @ApiProperty({ description: '파일 uuid' })
  uuid: string;
}
