import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import PageDTO from 'src/common/page.dto';

export default class GetFeedsDTO extends PageDTO {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'uuid 에 해당하는 유저 피드만 제공, 없을경우 전체 피드 제공',
  })
  userUuid?: string;
}
