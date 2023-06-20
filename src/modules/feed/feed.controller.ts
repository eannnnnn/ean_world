import { Body, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from 'src/open-api/api-response.decorator';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppFile } from 'src/open-api/app-file.decorator';
import { AppJwtGuard } from 'src/open-api/app-guard.decorator';
import { AppDelete, AppGet, AppPost } from 'src/open-api/app-method.decorator';
import { User } from '../account/account.decorator';
import JwtUser from '../account/dtos/jwt-user.dto';
import { FileType } from '../file/file.const';
import { CreateFeedDTO } from './dtos/create-feed.dto';
import GetFeedsDTO from './dtos/get-feeds.dto';
import FeedService from './feed.service';
import GetFeedResponse from './response/get-feed.response';
import { ErrorCode } from 'src/errors/error.const';

@AppController('/feed', '게시글')
export default class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @AppGet('/', '게시글 조회')
  @ApiOkResponse('결과', GetFeedResponse)
  async getFeeds(@Query() query: GetFeedsDTO) {
    return {
      totalCount: await this.feedService.getFeedCount(query),
      feeds: await this.feedService.getFeeds(query),
    };
  }

  @AppJwtGuard
  @AppFile('files', FileType.IMAGE, 7)
  @AppPost('/', '게시글 생성')
  @ApiCreatedResponse('결과 - 게시글 uuid', String)
  @ApiBadRequestResponse(
    {
      code: ErrorCode.FILE_NOT_ALLOWED,
      summary: '이미지 파일만 업로드 가능합니다.',
    },
    {
      code: ErrorCode.FILE_UPLOAD_FAILED,
      summary: '파일 업로드에 실패했습니다.',
    },
    {
      code: ErrorCode.FILE_MAX_LENGTH_EXCEEDED,
      summary: '파일 허용 갯수 초과 시',
    },
  )
  async createFeed(@User() user: JwtUser, @Body() body: CreateFeedDTO) {
    body.userId = user.id;
    return await this.feedService.createFeed(body);
  }

  @AppJwtGuard
  @AppPost('/:feedId', '게시글 수정 - 작업 중')
  async updateFeed() {
    // return await this.feedService.updateFeed();
  }

  @AppJwtGuard
  @AppDelete('/:feedId', '게시글 삭제 - 작업 중')
  async deleteFeed() {
    // return await this.feedService.deleteFeed();
  }
}
