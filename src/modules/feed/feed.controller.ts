import { Body, Param, Query } from '@nestjs/common';
import { ErrorCode } from 'src/errors/error.const';
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
import { DeleteFeedParamDTO } from './dtos/delete-feed.dto';
import GetFeedsDTO from './dtos/get-feeds.dto';
import { UpdateFeedDTO, UpdateFeedParamDTO } from './dtos/update-feed.dto';
import FeedService from './feed.service';
import GetFeedResponse from './response/get-feed.response';

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
    [ErrorCode.FILE_NOT_ALLOWED, '이미지 파일만 업로드 가능합니다.'],
    [ErrorCode.FILE_UPLOAD_FAILED, '파일 업로드에 실패했습니다.'],
    [ErrorCode.FILE_MAX_LENGTH_EXCEEDED, '파일 허용 갯수 초과 시'],
  )
  async createFeed(@User() user: JwtUser, @Body() body: CreateFeedDTO) {
    body.userId = user.id;
    return await this.feedService.createFeed(body);
  }

  @AppJwtGuard
  @AppFile('files', FileType.IMAGE, 7)
  @AppPost('/:uuid', '게시글 수정')
  @ApiOkResponse('결과 - 게시글 uuid', String)
  @ApiBadRequestResponse(
    [ErrorCode.FILE_NOT_ALLOWED, '이미지 파일만 업로드 가능합니다.'],
    [ErrorCode.FILE_UPLOAD_FAILED, '파일 업로드에 실패했습니다.'],
    [ErrorCode.FILE_MAX_LENGTH_EXCEEDED, '파일 허용 갯수 초과 시'],
    [ErrorCode.NOT_FOUND, '존재하지 않는 게시글입니다.'],
    [ErrorCode.FORBIDDEN, '게시글 작성자가 아닙니다.'],
  )
  async updateFeed(
    @User() user: JwtUser,
    @Param() { uuid }: UpdateFeedParamDTO,
    @Body() body: UpdateFeedDTO,
  ) {
    body.userId = user.id;
    return await this.feedService.updateFeed(uuid, body);
  }

  @AppJwtGuard
  @AppDelete('/:uuid', '게시글 삭제')
  @ApiOkResponse('결과 - true', Boolean)
  @ApiBadRequestResponse(
    [ErrorCode.NOT_FOUND, '존재하지 않는 게시글입니다.'],
    [ErrorCode.FORBIDDEN, '게시글 작성자가 아닙니다.'],
  )
  async deleteFeed(
    @User() user: JwtUser,
    @Param() { uuid }: DeleteFeedParamDTO,
  ) {
    return await this.feedService.deleteFeed(uuid, user.id);
  }
}
