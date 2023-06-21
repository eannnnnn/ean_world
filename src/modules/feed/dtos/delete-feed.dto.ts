import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteFeedParamDTO {
  @IsUUID()
  @ApiProperty({ description: '게시물 UUID' })
  uuid: string;
}
