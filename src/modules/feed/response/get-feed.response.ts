import { ApiProperty } from '@nestjs/swagger';

class Reply {
  @ApiProperty({ description: '댓글 ID' })
  replyId: number;
  @ApiProperty({ description: '댓글 내용' })
  contents: string;
  @ApiProperty({
    description: '댓글 단 시점',
    example: new Date().toISOString(),
  })
  createdAt: string;
  @ApiProperty({
    description: '댓글 업데이트 시점',
    example: new Date().toISOString(),
  })
  updatedAt: string;
}

class Feed {
  @ApiProperty({ description: '게시물 ID' })
  id: number;
  @ApiProperty({ description: '게시물 uuid' })
  uuid: string;
  @ApiProperty({ description: '작성자 uuid' })
  accountUuid: string;
  @ApiProperty({ description: '게시물 내용' })
  contents: string;
  @ApiProperty({
    description: '게시물 작성일',
    example: new Date().toISOString(),
  })
  createdAt: string;
  @ApiProperty({
    description: '게시물 수정일',
    example: new Date().toISOString(),
  })
  updatedAt: string;
  @ApiProperty({ description: '댓글 목록 ( 3 개까지 )', type: [Reply] })
  replies: Reply[];
}

export default class GetFeedResponse {
  @ApiProperty({ description: '피드 총 갯수' })
  totalCount: number;

  @ApiProperty({ description: '피드 리스트', type: [Feed] })
  feeds: Feed[];
}
