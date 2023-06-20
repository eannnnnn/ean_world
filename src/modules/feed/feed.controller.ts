import { Query, UseInterceptors } from '@nestjs/common';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppJwtGuard } from 'src/open-api/app-guard.decorator';
import { AppDelete, AppGet, AppPost } from 'src/open-api/app-method.decorator';
import { User } from '../account/account.decorator';
import JwtUser from '../account/dtos/jwt-user.dto';
import GetFeedsDTO from './dtos/get-feeds.dto';
import FeedService from './feed.service';
import { ApiOkResponse } from 'src/open-api/api-response.decorator';
import GetFeedResponse from './response/get-feed.response';
import { FileInterceptor } from '../file/file.interceptor';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { AppFile } from 'src/open-api/app-file.decorator';
import { FileType } from '../file/file.const';

@AppController('/feed', '피드 - 게시글')
export default class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @AppGet('/', '피드 조회')
  @ApiOkResponse('결과', GetFeedResponse)
  async getFeeds(@Query() query: GetFeedsDTO) {
    return {
      totalCount: await this.feedService.getFeedCount(query),
      feeds: await this.feedService.getFeeds(query),
    };
  }

  @AppJwtGuard
  @AppFile('file', FileType.IMAGE, 7)
  @ApiConsumes('multipart/form-data')
  @AppPost('/', '피드 생성 - 작업 중')
  async createFeed(@User() user: JwtUser) {
    return await this.feedService.createFeed({
      userId: user.id,
      contents: '피드 내용',
    });
  }

  @AppJwtGuard
  @AppPost('/:feedId', '피드 수정 - 작업 중')
  async updateFeed() {
    // return await this.feedService.updateFeed();
  }

  @AppJwtGuard
  @AppDelete('/:feedId', '피드 삭제 - 작업 중')
  async deleteFeed() {
    // return await this.feedService.deleteFeed();
  }
}
