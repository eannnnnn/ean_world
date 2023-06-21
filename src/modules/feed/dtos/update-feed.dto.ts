import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateFeedParamDTO {
  @IsUUID()
  @ApiProperty({ description: '게시물 UUID' })
  uuid: string;
}

export class UpdateFeedDTO {
  userId: number;

  @IsString()
  @ApiProperty({
    description: '게시물 내용',
    format: 'textarea',
  })
  contents: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({
    type: 'array',
    required: false,
    description:
      '게시물 이미지 업로드 (파일 | uuid) 유지 하는 이미지의 경우에는 uuid 를 보내주시고, 새로운 이미지를 업로드 하는 경우에는 파일을 보내주세요.',
    items: {
      type: 'file',
    },
  })
  files: number[];
}
