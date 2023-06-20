import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateFeedDTO {
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
    description: '게시물 이미지 업로드',
    items: {
      type: 'file',
    },
  })
  files: number[];
}
